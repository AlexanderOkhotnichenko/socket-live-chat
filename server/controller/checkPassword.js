const UserModel = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;
    const user = await UserModel.findById(userId);
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: 'Please check password',
        error: true
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email
    }
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '15s' });

    const cookieOption = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
    };

    return res.cookie('token', token, cookieOption).status(200).json({
      message: 'Login successfully',
      token: token,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}

module.exports = checkPassword