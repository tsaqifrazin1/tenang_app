const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const id = req.params._id;
    console.log(req.user);

    const user = await User.findById({ _id: id });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    res.status(200).send({
      isSuccess:true,
      data: {
        user,
      }
    });
  } catch (error) {
    next(error)
  }
};
