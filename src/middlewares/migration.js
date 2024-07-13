const fs = require('fs');
const path = require('path');
const Migration = require('../models/migration');

const migration = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const dir = path.join(__dirname, '..', 'migration');
    const files = fs.readdirSync(dir);
    for await (const file of files) {
      const existFile = await Migration.findOne({ file });
      if (!existFile) {
        const checkFormat = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-(2[0-3]|[01][0-9])-[0-5][0-9]-[0-5][0-9]-(.*)\.js/.exec(file);
        if (!checkFormat) {
          throw new Error(`${file} format not match : yyyy-mm-jj-hh-mn-ss-action-description.js`);
        }
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const script = await require(path.join(dir, file));
        console.info(`[${file}] Script running...`);
        await script();
        const newScript = new Migration({ file });
        await newScript.save();
        console.info(`[${file}] Success.`);
      }
    }
  } catch (e) {
    console.info(e);
    throw e;
  }
};

module.exports = migration;
