const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const Article = require("../../models/article");
const ArticlesValidator = require('../../validator/articles')
const mongoose = require('mongoose')

module.exports = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw new InvariantError("Tidak ada yang ingin diubah");
    }
    
    ArticlesValidator.validateArticlePayloadUpdate(req.body)
    const id = req.params._id;
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      throw new InvariantError("id tidak valid");
    }

    const updates = Object.keys(req.body);

    const article = await Article.findById({ _id: id }).exec();

    if (!article) {
      throw new NotFoundError("article tidak ditemukan.");
    }

    if(article.userId != req.user._id){
      throw new AuthorizationError("Can't update others article")
    }

    updates.forEach((update) => {
      article[update] = req.body[update];
    });

    await article.save();

    res.status(200).send({
      isSuccess: true,
      data: article,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
