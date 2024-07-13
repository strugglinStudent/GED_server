const { body, param } = require('express-validator');
const { validationExpressValidator } = require('../middlewares/validation-express-validator');
const { types } = require('../shared/enums');

const addUserValidation = [
  body('user.code', 'Please enter a valid code').not().isEmpty(), validationExpressValidator,
  body('user.name', 'Please enter a valid name').not().isEmpty(), validationExpressValidator,
  body('user.email', 'Please enter a valid email').not().isEmpty().isEmail(), validationExpressValidator,
  body('user.type', 'Please enter a valid type').isIn(Object.values(types)), validationExpressValidator,
];

const signUpUserValidation = [
  body('user.fullName', 'Please enter a valid full name').not().isEmpty(), validationExpressValidator,
  body('user.password', 'Please enter a valid password').not().isEmpty(), validationExpressValidator,
  body('user.email', 'Please enter a valid email').not().isEmpty().isEmail(), validationExpressValidator,
  body('confirmationSignUpUrl', 'Please enter a valid confirmation sign-up url').not().isEmpty(), validationExpressValidator,
];

const updateAvatarValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const loginValidation = [
  body('email', 'Please enter a valid email address').not().isEmpty().isEmail(), validationExpressValidator,
  body('password', 'Please enter a valid password').not().isEmpty(), validationExpressValidator,
];
const loginWithCodeValidation = [
  body('email', 'Please enter a valid email').not().isEmpty().isEmail(), validationExpressValidator,
  body('password', 'Please enter a valid password').not().isEmpty(), validationExpressValidator,
  body('code', 'Please enter the confirmation code').not().isEmpty(), validationExpressValidator,
];
const activateWithCodeValidation = [
  body('email', 'Please enter a valid email').not().isEmpty().isEmail(), validationExpressValidator,
  body('code', 'Please enter the confirmation code').not().isEmpty(), validationExpressValidator,
];
const getSingleUserValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const updateUserValidation = [
  body('name', 'Please enter a valid name').not().isEmpty(), validationExpressValidator,
  body('email', 'Please enter a valid mail').not().isEmpty().isEmail(), validationExpressValidator,
  body('defaultSite._id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const sendCodeValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
  body('password', 'Please enter a valid password').not().isEmpty(), validationExpressValidator,
];
const resetPasswordByIdValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(),
  body('password', 'Please enter a valid password').not().isEmpty(),
  body('newPassword', 'Please enter a valid newPassword').not().isEmpty(),
  body('code', 'Please enter a valid code').not().isEmpty(),
];

const resetPasswordByEmailValidation = [
  body('email', 'Please enter a valid mail').not().isEmpty().isEmail(), validationExpressValidator,
  body('newPassword', 'Please enter a valid newPassword').not().isEmpty(),
  body('code', 'Please enter a valid code').not().isEmpty(),
];
const checkPasswordValidation = [
  body('password', 'Please enter a valid password').not().isEmpty(), validationExpressValidator,
];
const checkForgotPasswordValidation = [
  body('email', 'Please enter a valid mail').not().isEmpty().isEmail(), validationExpressValidator,
  body('resetUrl', 'Please enter a valid Reset Url').not().isEmpty(), validationExpressValidator,
];
const getUserSitesValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const resendCodeValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const updateUserBetaValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const deleteUserValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const activateUserValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const getAllUsersValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
const getAllUsersByThirdPartyIdValidation = [
  param('id', 'Please enter a valid mongo id').isMongoId(), validationExpressValidator,
];
module.exports = {
  getSingleUserValidation,
  addUserValidation,
  updateAvatarValidation,
  loginValidation,
  loginWithCodeValidation,
  activateWithCodeValidation,
  updateUserValidation,
  sendCodeValidation,
  resetPasswordByIdValidation,
  resetPasswordByEmailValidation,
  checkPasswordValidation,
  getUserSitesValidation,
  resendCodeValidation,
  updateUserBetaValidation,
  deleteUserValidation,
  activateUserValidation,
  getAllUsersValidation,
  getAllUsersByThirdPartyIdValidation,
  checkForgotPasswordValidation,
  signUpUserValidation,
};
