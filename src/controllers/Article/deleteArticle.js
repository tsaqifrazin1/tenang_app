const Article = require("../../models/article");
const Comment = require("../../models/comment");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const mongoose = require('mongoose')
const {startSession } = require('mongoose')

module.exports = async (req, res, next) => {
  try {
    const id = req.params._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new InvariantError("id tidak valid");
    }

    const article = await Article.findById({ _id: id }).exec();

    if (!article) {
      throw new NotFoundError("article tidak ditemukan.");
    }

    if(article.userId != req.user._id){
      throw new AuthorizationError("Can't delete others article")
    }
    const session = await startSession()

    try {
      session.startTransaction();
      
      for(let i = 0; i<article.comments.length;i++){
        console.log(article.comments[i]._id)
        await Comment.deleteOne(
          {
            _id: article.comments[i]._id,
          },
          )
        };
        
      await article.remove();
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new InvariantError(error.message);
    }


    res.status(200).send({
      isSuccess: true,
      message: "Article deleted",
    });
  } catch (error) {
    next(error);
  }
};
