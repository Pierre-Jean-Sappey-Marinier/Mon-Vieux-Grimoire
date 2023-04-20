const Thing = require('../models/Thing'); // Thing  représente les objets stockés dans la base de données.
// router.use(express.json());
const fs = require('fs'); // fs  est un module Node.js qui permet de gérer les fichiers.

//Ecriture de la route POST dans une base de données
//un endpoint POST qui permet d'ajouter un nouvel objet dans la base de données.
//La méthode "save" de Mongoose est utilisée pour enregistrer l'objet dans la base de données
//et la réponse JSON contient un message de confirmation.
exports.createThing = (req, res, next) => {
  console.log('🚀 ~ file: stuff.js:11 ~ req:', req);
  const thingObject = JSON.parse(req.body.thing);
  // delete thingObject._id;
  // delete thingObject._userId;
  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
// exports.createThing = (req, res, next) => {
//   delete req.body._id;
//   const thing = new Thing({
//     ...req.body,
//   });
//   thing
//     .save()
//     .then(() => res.status(201).json({ message: "Objet enregistré !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

// Un endpoint PUT qui permet de modifier un objet dans la base de données.
//la méthode updateOne() de Mongoose pour mettre à jour l'objet correspondant à l'ID spécifié dans la requête.
//Cette méthode prend deux arguments : le premier est un objet de recherche qui spécifie l'objet à mettre à jour
// en utilisant l'ID fourni dans la requête, et le second est un objet de mise à jour qui contient les nouvelles
// valeurs pour les propriétés à mettre à jour de l'objet. Dans ce cas, l'objet de mise à jour est créé en
// copiant toutes les propriétés de la requête body en utilisant la syntaxe de déversement d'objet,
//puis en écrasant l'ID par défaut avec l'ID fourni dans la requête params.
exports.modifyThing = (req, res, next) => {
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

// exports.modifyThings = (req, res, next) => {
//   Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Objet modifié !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

// un endpoint DELETE qui permet de supprimer un objet à partir de l'ID dans l'URL
//Thing.deleteOne({ _id: req.params.id }) utilise la méthode deleteOne de Mongoose pour supprimer un objet
// de la base de données. Elle prend en paramètre un objet de filtre qui spécifie quel objet doit être supprimé.
//Ici, l'objet de filtre est { _id: req.params.id }, où _id correspond à l'ID de l'objet à supprimer, qui est
//fourni dans l'URL en utilisant req.params.id
exports.deleteThings = (req, res, next) => {
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
// exports.deleteThings = (req, res, next) => {
//   Thing.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Objet supprimé !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

// un endpoint GET qui permet de récupérer un objet à partir de l'ID dans l'URL
//Lorsque l'API reçoit une requête GET sur l'URL "/:id", elle appelle une fonction
//middleware qui récupère l'ID de l'objet dans la variable "req.params.id".
//Ensuite, la fonction middleware utilise la méthode "findOne" de l'objet "Thing" pour
//récupérer l'objet correspondant à cet ID dans la base de données.
//Si l'objet est trouvé, il est renvoyé au client sous forme de réponse JSON
exports.getThingFromId = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

//un endpoint GET qui permet de récupérer tous les objets de la base de données
exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
