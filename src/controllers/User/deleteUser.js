const User = require("../../models/user");
const NotFoundError = require("../../exceptions/NotFoundError");

module.exports = async (req, res, next) => {
  try {
    const id = req.params._id;

    const user = await User.findById({ _id: id }).exec();

    if (!user) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    await user.remove();

    res.status(200).send({
      isSuccess: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
