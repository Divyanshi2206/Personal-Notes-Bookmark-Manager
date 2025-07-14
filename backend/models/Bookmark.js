const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  tags: [String],
  favorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
