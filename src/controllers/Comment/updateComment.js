const mongoose = require("mongoose");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const Comment = require('../../models/comment')
const AuthorizationError = require('../../exceptions/AuthorizationError')

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
      throw new AuthorizationError("Can't update others comment")
    }

    await Comment.updateOne({_id:id},{
      body: req.body.body
    })

    const query = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: "$creator" },
      {
        $match: {
          _id:mongoose.Types.ObjectId(id)
        }
      },
      {
        $project: {
          body: 1,
          createdAt: 1,
          updatedAt:1,
          "creator.firstname":1,
          "creator.lastname":1
        },
      },
    ]

    const resComment = await Comment.aggregate(query)
    res.status(200).send({
      isSuccess: true,
      data: resComment[0],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
