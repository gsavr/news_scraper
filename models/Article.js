const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// new UserSchema object

const ArticleSchema = new Schema({
  title: {
    type: String,
    index: { unique: true },
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// create our model from the schema
const Article = mongoose.model("Article", ArticleSchema);

// export model
module.exports = Article;
