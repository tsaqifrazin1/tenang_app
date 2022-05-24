const User = require("../../models/user");
const InvariantError = require("../../exceptions/InvariantError");
const UsersValidator = require("../../validator/users")

module.exports = async (req, res, next) => {
  try {
    UsersValidator.validateUserPayload(req.body)
    const { firstname, lastname, email, password } = req.body;

    if (!req.body.role) {
      var role = "user";
    } else {
      var role = req.body.role;
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new InvariantError("Gagal melakukan Sign Up, User sudah ada.");
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role,
    });

    await newUser.validate()
    await newUser.save();

    res.status(201).json({
      isSuccess: true,
      message: "Berhasil menambahkan User",
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};
