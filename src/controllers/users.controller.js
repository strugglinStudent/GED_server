const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Company = require('../models/company');
const { errorCatch } = require('../shared/utils');
const { warpedJwtSign } = require('../shared/warped-jwt-sign');
const { warpedJwtRefreshSign } = require('../shared/warped-jwt-refresh-sign');
const sendEmail = require('../shared/warped-sendEmail'); // Adjust the path based on your file structure

const login = async (req, res) => {
  try {
    const user = req.body;
    const existedUser = await User.findOne({
      email: user.email.toLowerCase(),
    }).select('+password');
    if (!existedUser) {
      return res.status(400).json({
        messages: 'Address email is invalid',
      });
    }
    const isMatch = await bcryptjs.compare(user.password, existedUser.password);
    if (!isMatch) {
      return res.status(400).json({
        messages: 'password is invalid',
      });
    }
    const token = await warpedJwtRefreshSign(existedUser);
    return res.status(200).json(token);
  } catch (e) {
    return errorCatch(e, res);
  }
};
const refreshToken = async (req, res) => {
  try {
    const { refresh } = req.body;
    const user = jwt.verify(refresh, `${process.env.REFRESH_TOKEN_SECRET}`);
    const existedUser = await User.findOne({
      _id: user.id,
    });
    if (!existedUser) {
      return res.status(400).json({
        messages: 'Address email or password is invalid',
      });
    }
    const token = await warpedJwtSign(existedUser);
    return res.status(200).json({ token });
  } catch (e) {
    return errorCatch(e, res);
  }
};

const createUser = async (req, res) => {
  try {
    const {
      userName, email, password, role, companyName,
    } = req.body;

    // Check if the email is already taken
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).send('Email already exists');
    }

    // Check if the company exists
    if (req.user.role === 'SuperAdmin') {
      const company = await Company.findOne({ name: companyName });
      if (!company) {
        return res.status(404).send('Company not found');
      }
    }
    const criptedPassword = await bcryptjs.hash(password, await bcryptjs.genSalt(10));
    const newUser = new User({
      userName,
      email,
      password: criptedPassword,
      role: req.user.role === 'SuperAdmin' ? role : 'User',
      companyName: req.user.role === 'SuperAdmin' ? companyName : req.user.companyName,
    });
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = req.user.role === 'SuperAdmin' ? await User.find() : await User.find({ companyName: req.user.companyName });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (req.user.role === 'User' && req.params.id !== req.user.id) {
      res.status(403).send('Access Denied');
    }
    const user = req.user.role === 'Admin' ? await User.findOne({
      _id: req.params.id,
      companyName: req.user.companyName,
    }) : await User.findById(req.params.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const update = req.body;
    const user = req.user.role === 'SuperAdmin' ? await User.findById(update._id) : await User.findOne({
      _id: req.params.id,
      companyName: req.user.companyName,
    });
    if (!user) return res.sendStatus(404);
    // Check if the email is already taken by another user
    if (update.email && update.email !== user.email) {
      const userExists = await User.findOne({ email: update.email });
      if (userExists) {
        return res.status(400).send('Email already exists');
      }
    }
    if (update.userName && update.userName !== user.userName) {
      const userExists = await User.findOne({ userName: update.userName });
      if (userExists) {
        return res.status(400).send('userName already exists');
      }
    }
    user.userName = update.userName || user.userName;
    user.email = update.email || user.email;
    if (update.password) user.password = await bcryptjs.hash(update.password, await bcryptjs.genSalt(10));
    user.role = update.role || user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = req.user.role === 'SuperAdmin' ? await User.findByIdAndDelete(req.params.id) : await User.findById(req.params.id);
    if (req.user.role === 'Admin' && user.companyName === req.user.companyName) user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.sendStatus(404);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a unique reset token (e.g., using crypto library)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send email to admin to approve the reset request
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: 'Reset Password Request Approval',
      message: `Hello Admin,\n\nPlease approve the password reset request for ${user.email}.\n\nReset Token: ${resetToken}`,
    });

    res.status(200).json({ message: 'Reset request sent to admin for approval.' });
  } catch (error) {
    console.error('Error sending reset request:', error);
    res.status(500).json({ message: 'Failed to send reset request.' });
  }
};

// Function to approve reset request and send reset link
const resetPasswordApprove = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT token with user's email for password reset
    const token = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });

    // Construct the reset link
    const resetLink = `${process.env.URL_FRONT}/reset-password?token=${token}`;

    // Send reset link to user via email
    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      message: `Hello ${user.name},\n\nPlease click the following link to reset your password:\n\n${resetLink}`,
    });

    return res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id; // Assuming the authenticated user ID is available in req.user

  try {
    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, await bcryptjs.genSalt(10));

    // Update user's password in the database
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // Respond with success message
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again later.' });
  }
};
module.exports = {
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
};
