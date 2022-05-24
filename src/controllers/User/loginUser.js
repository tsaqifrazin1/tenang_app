const bcryptjs = require("bcryptjs");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Password atau email yang diberikan salah.");
    }

    await user.generateAuthToken();
    await user.generateRefreshToken();

    await user.save()

    res.status(201).send({
      isSuccess: true,
      message: "Login berhasil",
      data: {
          accessToken: user.token,
          refreshToken: user.refreshToken,
          _id : user._id
      }
    });
  } catch (error) {
    next(error);
  }
};
