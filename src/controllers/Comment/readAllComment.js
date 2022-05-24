const Article = require("../../models/article");
const NotFoundError = require("../../exceptions/NotFoundError");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    let articleId = req.params.articleId;
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throw new InvariantError("id tidak valid");
    }

    const article = await Article.findById({ _id: articleId }).exec();


    if (!article) {
      throw new NotFoundError("Article tidak ditemukan.");
    }

    const query = [
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $unwind: {
          path: "$comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "comments.creator",
        },
      },
      {
        $unwind: {
          path: "$comments.creator",
        },
      },
      {
        $group: {
          _id: "$_id",
          comments: {
            $push: "$comments",
          },
        },
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "_id",
          as: "articles",
        },
      },
      {
        $unwind: {
          path: "$articles",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "articles.userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields: {
          "articles.comments": "$comments",
        },
      },{
        $addFields: {
          "articles.author": "$author",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$articles",
        },
      },
      {
        $project: {
          title: 1,
          tags: 1,
          body: 1,
          createdAt: 1,
          "comments.body":1,
          "comments.creator.firstname": 1,
          "comments.creator.lastname": 1,
          "author.firstname":1,
          "author.lastname":1
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(articleId),
        },
      },
    ];

    const resComment = await Article.aggregate(query);

    if(!resComment.length){
      throw new NotFoundError('No comments in this Article')
    }
    res.status(200).send({
      isSuccess: true,
      data: resComment[0],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
