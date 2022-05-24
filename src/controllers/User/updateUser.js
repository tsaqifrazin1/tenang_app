const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const User = require("../../models/user");
const UsersValidator = require("../../validator/users");

module.exports = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw new InvariantError("Tidak ada yang ingin diubah");
    }
    
    UsersValidator.validateUserPayloadUpdate(req.body);
    const id = req.params._id;

    const updates = Object.keys(req.body);

    const user = await User.findById({ _id: id }).exec();

    if (!user) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.status(200).send({
      isSuccess: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
