const Comment = require("../../models/comment");
const Article = require("../../models/article");
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
    
    const comment = await Comment.findById({ _id: id }).exec();
    
    if (!comment) {
      throw new NotFoundError("comment tidak ditemukan.");
    }

    if(comment.userId != req.user._id){
      throw new AuthorizationError("Can't delete others comment")
    }

    const session = await startSession()
    try{
      session.startTransaction()
      await Comment.deleteOne({_id:id});
  
      await Article.updateOne(
        {
          _id: comment.articleId,
        },
        {
          $pull: { comments: id },
        }
      );

      await session.commitTransaction()
      session.endSession()
    }catch(error){
      await session.abortTransaction()
      session.endSession()
      throw new InvariantError(error.message)
    }

    res.status(200).send({
      isSuccess: true,
      message: "Comment deleted",
    });
  } catch (error) {
    next(error);
  }
};
