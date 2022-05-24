const jwt = require("jsonwebtoken");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new InvariantError("Harus memberikan refreshToken");
    }

    await jwt.verify(refreshToken, process.env.REF_TOKEN_SECRET);
    const user = await User.findOne(refreshToken._id).exec();

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    await user.generateAuthToken();
    res.status(200).send({
      isSuccess: true,
      message: "Refresh token successful",
      data: {
          accessToken: user.token,
      }
    });
  } catch (error) {
    next(error);
  }
};
