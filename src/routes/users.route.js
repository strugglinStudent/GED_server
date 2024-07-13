const express = require('express');
const {
  login,
  refreshToken,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  forgetPassword,
  resetPasswordApprove,
} = require('../controllers/users.controller');
const {
  isAuth,
  isAuthorized,
  validateResetToken,
} = require('../middlewares/authorization');

const userRoute = express.Router();
// Sign in
userRoute.post('/login',
  login);
// Refresh token
userRoute.post('/refreshToken',
  refreshToken);
// Reset password request
userRoute.post('/reset-password-approved',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), resetPasswordApprove);
// Forget password request
userRoute.post('/forget-password',
  forgetPassword);
// Reset password
userRoute.post('/reset-password/:token',
  validateResetToken, resetPassword);
// Create a new user
userRoute.post('/',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), createUser);
// Get all users
userRoute.get('/',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), getUsers);
// Get a user by ID
userRoute.get('/:id',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), getUserById);
// Update a user by ID
userRoute.put('/:id',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), updateUser);
// Delete a user by ID
userRoute.delete('/:id',
  isAuth, isAuthorized('SuperAdmin', 'Admin'), deleteUser);

module.exports = userRoute;
