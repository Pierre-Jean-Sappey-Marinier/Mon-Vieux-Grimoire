const express = require('express');
const bookCtrl = require('../controllers/book.js');

const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');
const sharp = require('../middleware/sharp.js');

const router = express.Router();

router.use(express.json());

router.get('/', bookCtrl.getAllBooks);

router.post('/', auth, multer, sharp, bookCtrl.createBook);

router.get('/bestrating', bookCtrl.getBestRating);

router.get('/:id', bookCtrl.getBookFromId);

router.post('/:id/rating', auth, multer, bookCtrl.addNote);

router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
