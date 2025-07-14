const Bookmark = require('../models/Bookmark');
const validUrl = require('valid-url');
const axios = require('axios');

exports.createBookmark = async (req, res) => {
  try {
    const { url, title } = req.body;

    if (!validUrl.isUri(url)) return res.status(400).json({ error: 'Invalid URL' });

    let bookmarkTitle = title;

    if (!bookmarkTitle) {
      const { data } = await axios.get(url);
      const match = data.match(/<title>(.*?)<\/title>/i);
      bookmarkTitle = match ? match[1] : url;
    }

    const bookmark = new Bookmark({ ...req.body, title: bookmarkTitle });
    const saved = await bookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = {};

    if (q) filter.title = new RegExp(q, 'i');
    if (tags) filter.tags = { $in: tags.split(',') };

    const bookmarks = await Bookmark.find(filter);
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    bookmark ? res.json(bookmark) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    bookmark ? res.json(bookmark) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const result = await Bookmark.findByIdAndDelete(req.params.id);
    result ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
