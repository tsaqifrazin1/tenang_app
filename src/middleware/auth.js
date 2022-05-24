const jwt = require('jsonwebtoken');

require('dotenv').config();
const AuthenticationError = require('../exceptions/AuthenticationError')
const User = require('../models/user')

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) {
      throw new AuthenticationError('Token dibutuhkan untuk authentication');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded._id)
      const cek = await User.findOne({_id:decoded._id})
      if(!cek){
        throw new AuthenticationError('Token invalid')
      }
      req.user = decoded;
    } catch (err) {
      throw new AuthenticationError('Token invalid');
    }
    return next();
  } catch (error) {
      next(error)
  }
};