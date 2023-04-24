const sharp = require('sharp');
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     console.log('🚀 ~ file: multer-config.js:48 ~ req:', file);
//     // sharp(req.file.path)
//     //   .png({ quality: 60 })
//     //   .toFile('./test/' + req.file.filename)
//     //   .then((data) => {
//     //     console.log('freussite', data);
//     //     next();
//     //   })
//     //   .catch((err) => {
//     //     console.log('Error', err);
//     //     next(err);
//     //   });
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_');
//     const extension = MIME_TYPES[file.mimetype];
//     const today = new Date();
//     const day = today.getDate();
//     const month = today.getMonth() + 1; // Les mois sont indexés à partir de 0
//     const year = today.getFullYear();
//     callback(null, name + `${day}-${month}-${year}` + '.' + extension);
//   },
// });

module.exports = multer().single('image');
