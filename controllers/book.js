const Book = require('../models/Book');

const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);

  const name = req.file.fieldname.split(' ').join('_');

  const book = new Book({
    ...bookObject,
    // userId:bookObject.userId,c
    // title: bookObject.title,
    // author: bookObject.author,
    // year: bookObject.year,
    // genre: bookObject.genre,
    // ratings: bookObject.ratings,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.name}`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.addNote = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((bookObjectf) => {
      bookObjectf.ratings.push({
        userId: req.body.userId,
        grade: req.body.rating,
        _id: req.body._id,
      });
      let somme = 0;
      for (let i = 0; i < bookObjectf.ratings.length; i++) {
        somme += bookObjectf.ratings[i].grade;
      }
      let moyenne = somme / bookObjectf.ratings.length;
      bookObjectf.averageRating = Math.ceil(moyenne);

      bookObjectf
        .save()
        .then(() => res.status(200).json(bookObjectf))
        // .then(() => location.reload())
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.name
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: ' unauthorized request' });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getBookFromId = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
