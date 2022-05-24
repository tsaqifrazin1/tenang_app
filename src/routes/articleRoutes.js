const express = require('express');

const router = express.Router();

const { articleController } = require('../controllers');

const { auth } = require('../middleware');

router.post('/', auth, articleController.createArticle);

router.get('/', articleController.readArticle);

router.put('/:_id', auth, articleController.updateArticle);

router.delete('/:_id', auth, articleController.deleteArticle);


module.exports = router;