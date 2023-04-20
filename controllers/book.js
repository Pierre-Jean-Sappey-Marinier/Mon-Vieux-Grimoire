const Thing = require('../models/Book');

const fs = require('fs');

exports.createBook = (req, res, next) => {
  const thingObject = JSON.parse(req.body.book);
  console.log('🚀 ~ file: stuff.js:32 ~ req:', thingObject);
  // delete thingObject._id;
  // delete thingObject._userId;
  const thing = new Thing({
    ...thingObject,
    // userId: req.body.book.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  console.log('🚀 ~ file: stuff.js:43 ~ thing:', thing);

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.addNote = (req, res, next) => {
  const thingObject = JSON.parse(req.body.book);
  console.log('🚀 ~ file: stuff.js:32 ~ req:', thingObject);
  // delete thingObject._id;
  // delete thingObject._userId;
  const thing = new Thing({
    ...thingObject,
    // userId: req.body.book.userId,
  });
  console.log('🚀 ~ file: stuff.js:43 ~ thing:', thing);

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Thing.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
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
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
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
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
