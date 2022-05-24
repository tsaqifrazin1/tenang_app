const Article = require("../../models/article")
const ArticlesValidator = require('../../validator/articles')

module.exports = async (req, res, next) => {
  try {
    ArticlesValidator.validateArticlePayload(req.body)
    const { title, body, tags} = req.body;
    const userId = req.user._id

    const newArticle = new Article({
      title, body, tags, userId
    });

    await newArticle.validate()
    await newArticle.save();

    res.status(201).json({
      isSuccess: true,
      message: "Berhasil menambahkan Article",
      data: newArticle
    });
  } catch (error) {
    next(error);
  }
};
