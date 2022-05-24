const express = require('express');

const router = express.Router();

const { userController } = require('../controllers');

const { auth, adminAuthorization, meAuthorization } = require('../middleware');

router.post('/register', userController.createUser);

router.get('/profile/:_id', auth, meAuthorization, userController.readOneUser);

router.get('/list', auth, adminAuthorization, userController.readAllUsers);

router.put('/update/:_id', auth, adminAuthorization, userController.updateUser);

router.delete('/delete/:_id', auth, adminAuthorization, userController.deleteUser);

router.post('/login', userController.loginUser);

router.post('/refresh', userController.refreshTokenUser);

router.get('/logout/:_id', auth, meAuthorization, userController.logoutUser);

module.exports = router;