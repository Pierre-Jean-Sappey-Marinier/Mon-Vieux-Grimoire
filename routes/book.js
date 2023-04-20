const express = require('express');
const stuffCtrl = require('../controllers/book.js');

const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');

const router = express.Router();

router.use(express.json());

router.get('/', stuffCtrl.getAllBooks);

router.post('/', auth, multer, stuffCtrl.createBook);
router.post('/:id/rating', multer, stuffCtrl.addNote);
router.get('/:id', stuffCtrl.getBookFromId);

router.put('/:id', auth, multer, stuffCtrl.modifyBook);

router.delete('/:id', auth, stuffCtrl.deleteBook);

module.exports = router;
