const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: String,
    votes: {
      up: Number,
      down: Number,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
