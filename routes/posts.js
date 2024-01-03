const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },
  image: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
