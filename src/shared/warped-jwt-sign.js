const jwt = require('jsonwebtoken');

const warpedJwtSign = async (user) => new Promise((resolve, reject) => {
  const expiresIn = 3600 * 10;

  const {
    id,
    email,
    role,
    companyName,
  } = user;
  return jwt.sign(
    {
      id,
      email,
      role,
      companyName,
    },
    `${process.env.PRIVATE_KEY}`, {
      expiresIn,
    },
    (error, token) => {
      if (error) {
        return reject(error);
      }

      return resolve(token);
    },
  );
});
module.exports = { warpedJwtSign };
