const express = require('express');

const router = express.Router();

const { commentController } = require('../controllers');

const { auth } = require('../middleware');

router.post('/:articleId/comments', auth, commentController.createComment);

router.get('/:articleId/comments', commentController.readAllComment);

router.get('/:_id', commentController.readOneComment);

router.put('/:_id', auth, commentController.updateComment);

router.delete('/:_id', auth, commentController.deleteComment);


module.exports = router;