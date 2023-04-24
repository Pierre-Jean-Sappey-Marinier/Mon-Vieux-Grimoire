const sharp = require('sharp');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
module.exports = (req, res, next) => {
  console.log('🚀 ~ file: sharp.js:4 ~ req:', req.file);

  const name = req.file.fieldname.split(' ').join('_');
  const extension = MIME_TYPES[req.file.mimetype];
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  // callback(null, name + `${day}-${month}-${year}` + '.' + extension);

  if (!req.file.mimetype.match(/\/(png|jpg|jpeg)$/)) {
    return next();
  }
  sharp(req.file.buffer)
    .png({ quality: 60 })
    .toFile(
      './images/' +
        `${day}-${month}-${year}` +
        '-' +
        'key' +
        '-' +
        Date.now() +
        '.' +
        extension
    )
    .then((data) => {
      console.log('freussite', data);
      next();
    })
    .catch((err) => {
      console.log('Error', err);
      next(err);
    });
};
