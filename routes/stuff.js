const express = require('express');
const stuffCtrl = require('../controllers/stuff.js');

const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');

const router = express.Router();

router.use(express.json());

router.get('/', auth, stuffCtrl.getAllThings);

router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getThingFromId);

router.put('/:id', auth, multer, stuffCtrl.modifyThing);

router.delete('/:id', auth, stuffCtrl.deleteThings);

module.exports = router;

//Ce code définit les routes de l'application en utilisant l'objet Router d'Express. Les routes définies sont associées aux fonctions du contrôleur stuffCtrl importé depuis le fichier "../controllers/stuff.js".

//Les différentes routes sont :

//GET / : appelle la fonction getAllStuff du contrôleur stuffCtrl pour renvoyer tous les objets de la base de données.
//POST / : appelle la fonction createThing du contrôleur stuffCtrl pour créer un nouvel objet dans la base de données.
//GET /:id : appelle la fonction getOneThing du contrôleur stuffCtrl pour renvoyer un objet spécifique de la base de données en fonction de son id.
//PUT /:id : appelle la fonction modifyThing du contrôleur stuffCtrl pour modifier un objet spécifique de la base de données en fonction de son id.
//DELETE /:id : appelle la fonction deleteThing du contrôleur stuffCtrl pour supprimer un objet spécifique de la base de données en fonction de son id.

//Lorsque la fonction next() est appelée dans une route, cela permet de passer la main à la route suivante.

//Enfin, l'objet router est exporté pour être utilisé dans d'autres fichiers.
