const { exec } = require('child_process');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const gittags = require('git-tags');

const pattern = /(\[(FEATURE|BUGFIX|DOCS|STYLE|REFACTO|TEST|QUALITY|CHORE|RELEASE)\](\[(INN|HMP|HLP|PAY|AUT|TMS|GEO|CRM|WF|GED)-(\d)+\])? [A-Z]).*/g;

const types = 'FEATURE|BUGFIX|DOCS|STYLE|REFACTO|TEST|QUALITY|CHORE'.split('|');

const argv = [];

const commitAndRelease = (version) => {
  let versionType = '';
  if (version) {
    const versionSplit = version.split('.');
    const minor = versionSplit[2];
    if (minor === '0') {
      versionType = 'patch';
    } else if (minor !== '0') {
      versionType = 'minor';
    }
  }
  console.info('versionType', versionType);
  exec(
    // eslint-disable-next-line max-len
    `git add . && git commit -m "[RELEASE][CI SKIP] Update changelog" && git push https://gitlab-ci:${process.env.ACCESS_TOKEN}@${process.env.CI_SERVER_HOST}/${process.env.CI_PROJECT_PATH}.git HEAD:main && git tag -a v${version} -m "[RELEASE][CI SKIP] Update changelog" && git push https://gitlab-ci:${process.env.ACCESS_TOKEN}@${process.env.CI_SERVER_HOST}/${process.env.CI_PROJECT_PATH}.git v${version}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        throw error;
      }
      if (versionType === 'patch') {
        exec(
          `git clone https://gitlab-ci:${process.env.ACCESS_TOKEN}@${process.env.CI_SERVER_HOST}/${process.env.CI_PROJECT_PATH}.git && cd ${process.env.CI_PROJECT_NAME} && npm run release && git add . && `
          + `git commit -m "[RELEASE] Increase next develop version of v${version}" && git push https://gitlab-ci:${process.env.ACCESS_TOKEN}@${process.env.CI_SERVER_HOST}/${process.env.CI_PROJECT_PATH}.git HEAD:develop`,
          (error1, stdout1, stderr1) => {
            if (error1) {
              console.error(stderr1);
              throw error1;
            }
          },
        );
      } else if (versionType !== 'minor') {
        throw new Error('versionType not good');
      }
    },
  );
};

const createUdateChangeLog = (ticketsByTypes, version) => {
  const now = new Date();
  let month = now.getMonth() + 1;
  month = month > 9 ? month : `0${month}`;
  const date = `${now.getFullYear()}-${month}-${now.getDate()}`;
  const title = '\n# GED-NOVA NODE\n# Release Notes';
  let changelog = `${title}

## ${version} ( ${date} )

`;
  Object.keys(ticketsByTypes).forEach((type) => {
    changelog
      += `### ${type}
`;
    ticketsByTypes[type].forEach((commit) => {
      changelog
        += `* ${commit}
`;
    });
  });

  const path = './CHANGELOG.md';

  if (fs.existsSync(path)) {
    // file exists
    const data = fs.readFileSync(path, 'utf8');
    const newdata = data.replace(title, changelog);

    console.info('newdata', newdata);

    fs.writeFileSync(path, newdata, { flag: 'w' });
    console.info('CHANGELOG exist and it\'s saved!');
  } else {
    console.info('changelog', changelog);
    fs.writeFileSync(path, changelog, { flag: 'wx' });
    console.info('CHANGELOG !exist and it\'s saved!');
  }
  commitAndRelease(version);
};

const generateDiff = (targetTag = null, beforeTag = null, version = null) => {
  console.info(`Diff between ${beforeTag}..${targetTag}`);
  let interval = '';
  if (targetTag && beforeTag) {
    interval = `${beforeTag}..${targetTag}`;
  }
  exec(
    `git log --no-merges ${interval} --pretty=oneline`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        throw error;
      }
      const logsMessages = stdout.toString().split(/\r?\n/g).filter(Boolean);
      let tickets = [];
      logsMessages.forEach((logMessage) => {
        const regexResult = logMessage.match(pattern);
        if (regexResult && regexResult[0]) {
          tickets.push(regexResult[0]);
        }
      });
      tickets = tickets.filter((value, index, self) => self.indexOf(value) === index);
      const ticketsByTypes = {};
      tickets.forEach((ticket) => {
        types.forEach((type) => {
          if (ticket.startsWith(`[${type}]`)) {
            if (!ticketsByTypes[type]) {
              ticketsByTypes[type] = [];
            }
            ticketsByTypes[type].push(ticket);
          }
        });
      });
      createUdateChangeLog(ticketsByTypes, version);
    },
  );
};

gittags.get((err, tags) => {
  if (err) throw err;
  exec(
    'git checkout origin/main',
    (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(stderr2);
        throw error2;
      }
      process.argv.forEach((val, index) => {
        argv[index] = val;
      });
      const version = argv[2];
      let lastTag = null;
      console.info('tags', tags, 'version', version);
      if (tags && tags.length >= 1 && version) {
        [lastTag] = tags;
        if (lastTag === `v${version}`) {
          throw new Error('version not good');
        }
        exec(
          `git rev-list -n 1 ${lastTag}`,
          (error1, stdout1, stderr1) => {
            if (error1) throw stderr1;
            const beforeLastTag = stdout1.replace(/\r?\n/g, '');
            generateDiff('HEAD', beforeLastTag, version);
          },
        );
      } else {
        generateDiff(null, null, version);
      }
    },
  );
});
