const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const note = new Note(req.body);
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = {};

    if (q) filter.title = new RegExp(q, 'i');
    if (tags) filter.tags = { $in: tags.split(',') };

    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note ? res.json(note) : res.status(404).json({ error: 'Note not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    note ? res.json(note) : res.status(404).json({ error: 'Note not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const result = await Note.findByIdAndDelete(req.params.id);
    result ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Note not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
