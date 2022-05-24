const AuthorizationError = require("../exceptions/AuthorizationError");

module.exports = async (req, res, next) => {
  try {
    const role = req.user.role;
    const id = req.params._id;
    if (role == "admin" || req.user._id == id) {
      next();
    } else {
      throw new AuthorizationError('Tidak dapat mengakses');
    }
  } catch (error) {
    next(error);
  }
};
