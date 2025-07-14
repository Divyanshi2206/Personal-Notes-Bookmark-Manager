const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController');

router.post('/', controller.createNote);
router.get('/', controller.getNotes);
router.get('/:id', controller.getNoteById);
router.put('/:id', controller.updateNote);
router.delete('/:id', controller.deleteNote);

module.exports = router;
