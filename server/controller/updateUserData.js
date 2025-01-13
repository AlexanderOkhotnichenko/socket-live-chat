const getUserDataFromToken = require("../helpers/getUserDataFromToken");
const UserModel = require("../models/User");

async function updateUserData(req, res) {
  try {
    const token = req.cookies.token || '';
    const user = await getUserDataFromToken(token);
    const { firstName, profile_pic } = req.body;
    const updateUser = await UserModel.updateOne({ _id: user._id }, { firstName, profile_pic });
    const userData = await UserModel.findById(user._id);

    return res.json({
      message: 'User update succesfully',
      data: userData,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}

module.exports = updateUserData