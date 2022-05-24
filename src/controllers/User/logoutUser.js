const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const id = req.params._id;
    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    user.token = "";

    user.refreshToken = "";

    await user.save();

    res.status(200).send({
      isSuccess: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
