const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (!users) {
      throw new NotFoundError("User tidak ditemukan");
    }

    res.status(200).send({
      isSuccess: true,
      data: {
        users,
      }
    });
  } catch (error) {
    next(error)
  }
};
