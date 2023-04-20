//Ce code utilise le module multer pour gérer le téléchargement d'images dans une application Node.js. Voici ce que chaque partie du code fait :

//La première ligne importe le module multer dans le code.

//MIME_TYPES est un objet qui associe les types MIME des images à leurs extensions de fichier correspondantes. Cette information est utilisée dans la fonction filename définie plus tard pour générer le nom de fichier correct pour chaque image téléchargée.

//storage est un objet qui contient des fonctions pour définir où les fichiers téléchargés doivent être stockés et comment ils doivent être nommés. Dans ce cas, la fonction destination spécifie que les fichiers doivent être stockés dans un répertoire appelé "images". La fonction filename utilise le nom d'origine du fichier téléchargé, remplace les espaces par des underscores, ajoute la date actuelle pour éviter les conflits de nom et utilise le type MIME du fichier pour obtenir l'extension de fichier correcte.

//module.exports est une instruction qui rend la fonction multer() disponible en tant que module. La fonction multer() est utilisée pour créer un middleware qui sera utilisé dans une route de téléchargement d'images. Le middleware est créé en passant l'objet storage à la fonction multer(). La méthode single() spécifie qu'une seule image sera téléchargée. Dans ce cas, le champ d'entrée pour le fichier sera appelé "image".

//En résumé, ce code permet de définir un middleware pour gérer le téléchargement d'images dans une application Node.js en utilisant le module multer. La fonction multer() est utilisée pour créer le middleware en passant l'objet storage contenant les fonctions de gestion des fichiers. Le middleware est créé pour gérer une seule image à la fois, qui sera stockée dans le répertoire "images" et nommée en fonction de son nom d'origine et de sa date de téléchargement.

const multer = require("multer");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
