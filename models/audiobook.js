const mongoose = require("mongoose");

const audiobookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageURL: {
      type: String,
      required: true,
    },
    audiobookUrl: {
      type: String,
      required: true,
    },
    series: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("audiobook", audiobookSchema);