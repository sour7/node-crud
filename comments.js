const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  text: { type: String },
});

module.exports = mongoose.model("comments", commentSchema);
