const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// note Schema
const NoteSchema = new Schema({
  body: String
});

// create model
const Note = mongoose.model("Note", NoteSchema);

// export model
module.exports = Note;
