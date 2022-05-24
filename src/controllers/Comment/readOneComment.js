const Comment = require("../../models/comment");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    let commentId = req.params._id;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new InvariantError("id tidak valid");
    }

    const query = [
        {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "creator",
            },
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
          {
            $match: {
              _id: mongoose.Types.ObjectId(commentId),
            },
          },
    ]
    const comment = await Comment.aggregate(query)

    if (!comment.length) {
      throw new NotFoundError("Comment tidak ditemukan.");
    }

    res.status(200).send({
      isSuccess: true,
      data: comment[0],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};