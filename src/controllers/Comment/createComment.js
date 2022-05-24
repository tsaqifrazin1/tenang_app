const Comment = require("../../models/comment");
const Article = require("../../models/article");
const CommentsValidator = require("../../validator/comments");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const { startSession } = require("mongoose");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throw new InvariantError("id tidak valid");
    }

    CommentsValidator.validateCommentPayload(req.body);
    const article = await Article.findOne({ _id: articleId });
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    const newComment = new Comment({
      body: req.body.body,
      userId: req.user._id,
      articleId: articleId,
    });

    const session = await startSession();
    try {
      session.startTransaction();
      var commentData = await newComment.save();

      await Article.updateOne(
        {
          _id: articleId,
        },
        {
          $push: { comments: commentData._id },
        }
      );

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new InvariantError(error.message);
    }

    res.status(201).json({
      isSuccess: true,
      message: "Berhasil menambahkan Comment",
      data: commentData,
    });
  } catch (error) {
    next(error);
  }
};
