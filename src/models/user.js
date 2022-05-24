const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { REF_TOKEN_SECRET } = process.env;


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        required: true
    },
    token: {
        type: String
    },

    refreshToken: {
        type: String
    },

        
});

UserSchema.methods.generateAuthToken = function () {
    const User = this;
    const secret = JWT_SECRET;
    const token = jwt.sign({ _id: User._id, role: User.role  }, secret, {
        expiresIn: '10m',
      },);
    User.token = token;
}

UserSchema.methods.generateRefreshToken = function () {
    const User = this;
    const secret = REF_TOKEN_SECRET;
    const refreshToken = jwt.sign({ _id: User._id, role: User.role }, secret, {
        expiresIn: '30m',
      },);
    User.refreshToken = refreshToken;
}

UserSchema.pre('save', async function (next) {
    const User = this;
    if (User.isModified('password')) {
        User.password = await bcryptjs.hash(User.password, 12);
    }
    next();
});

const User = mongoose.model('user', UserSchema);
module.exports = User;