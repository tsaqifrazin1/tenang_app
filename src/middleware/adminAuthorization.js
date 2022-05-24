const AuthorizationError = require("../exceptions/AuthorizationError");

module.exports = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == "admin") {
      next();
    } else {
        throw new AuthorizationError('Tidak dapat mengakses');
    }
  } catch (error) {
    next(error);
  }
};
