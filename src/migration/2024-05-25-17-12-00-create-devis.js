const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const Company = require('../models/company');

const script = async () => {
  try {
    await Company.create({
      name: 'tic-nova',
      address: 'somwhere',
      email: 'tech1@tic-nova.com',
    });
  } catch (e) {
    throw new Error('No company was created');
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const criptedPassword = await bcryptjs.hash('Test123.', salt);
    await User.create({
      email: 'tech@tic-nova.com',
      userName: 'techsuperadmin',
      password: criptedPassword,
      role: 'SuperAdmin',
      companyName: 'tic-nova',
    });
  } catch (e) {
    throw new Error('No account was created');
  }
};
module.exports = script;
