const jwt = require('jsonwebtoken');

const warpedJwtRefreshSign = async (user) => {
  try {
    const expiresIn = 3600 * 10;
    const expiresRefrech = '3000y';
    const {
      id,
      email,
      role,
      companyName,
    } = user;
    const token = jwt.sign(
      {
        id,
        email,
        role,
        companyName,
      },
      `${process.env.PRIVATE_KEY}`,
      { expiresIn },
    );
    const refreshToken = jwt.sign(
      {
        id,
        role,
        companyName,
      },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: expiresRefrech },
    );
    return Promise.resolve({
      token,
      refreshToken,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
module.exports = { warpedJwtRefreshSign };
