const express = require('express');
const cors = require('cors');

const noteRoutes = require('./routes/noteRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.get('/', (req, res) => {
  res.send('📘 Notes & Bookmarks API is running');
});

module.exports = app;
