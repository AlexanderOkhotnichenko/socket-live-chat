async function logout(req, res) {
  try {
    const cookieOption = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    return res.cookie('token', '', cookieOption).status(200).json({
      message: 'Session out',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}

module.exports = logout