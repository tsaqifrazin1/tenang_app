const ClientError = require('../exceptions/ClientError');
module.exports = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ClientError) {
    res.status(err.statusCode).json({
      isSuccess: false,
      message: err.message,
    });
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      status: 400,
      isSuccess: false,
      message: err.message,
    });
  } else if (err.name === "CastError") {
    res.status(400).json({
      status: 400,
      isSuccess: false,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      isSuccess: false,
      message: "internal server eror",
    });
  }
};
