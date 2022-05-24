const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    body: {
      type: String,
      required: true,
    },
    comments:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    }]
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("article", articleSchema);
module.exports = Article;
