const Article = require("../../models/article");
const NotFoundError = require("../../exceptions/NotFoundError");
const { default: mongoose } = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    let queryTotal = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: "$creator" },
    ];

    if (req.query.title) {
      queryTotal.push({
        $match: {
          title: req.query.title,
        },
      });
    }
    if (req.query.tags) {
      queryTotal.push({
        $match: {
          tags: req.query.tags,
        },
      });
    }
    if (req.query.userId) {
      queryTotal.push({
        $match: {
          userId: mongoose.Types.ObjectId(req.query.userId),
        },
      });
    }

    const query = Object.assign([], queryTotal);

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let skip = (page - 1) * limit;

    query.push({ $skip: skip });
    query.push({ $limit: limit });

    query.push({
      $project: {
        title: 1,
        tags: 1,
        body: 1,
        createdAt: 1,
        updatedAt:1,
        "creator.firstname": 1,
        "creator.lastname": 1,
        comments:1
      },
    });

    if (req.query.sortBy && req.query.sortOrder) {
      var sort = {};
      sort[req.query.sortBy] = req.query.sortOrder == "asc" ? 1 : -1;
      query.push({
        $sort: sort,
      });
    } else {
      query.push({
        $sort: { createdAt: 1 },
      });
    }
    let articles = await Article.aggregate(query);

    if (!articles.length) {
      throw new NotFoundError("We dont have Article you looking for");
    }

    queryTotal.push({
      $facet: {
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    queryTotal.push({
      $unwind: "$totalCount",
    });

    const total = await Article.aggregate(queryTotal);
    res.status(200).json({
      isSuccess: true,
      results: articles.length,
      data: {
        articles,
        meta: {
          total: total[0].totalCount.count,
          currentPage: page,
          perPage: limit,
          totalPages: Math.ceil(total[0].totalCount.count / limit),
        },
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
