const { v4: uuidv4 } = require('uuid');

const sharp = require('sharp');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
module.exports = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const randomName = uuidv4();
  console.log('req.file', req.file);
  const extension = MIME_TYPES[req.file.mimetype];
  console.log('🚀 ~ file: sharp.js:15 ~ extension:', extension);

  // if (!req.file.mimetype.match(/\/(png)$/)) {
  if (!req.file.mimetype.match(/\/(png|jpg|jpeg)$/)) {
    // sharp(req.file.buffer)
    // .toFile(`./images/${day}-${month}-${year}${Date.now()}.${extension}`)
    // .toFile(`./images/${name}`)
    // .then((data) => {
    //   req.file.name = `${name}`;
    // });
    return next();
  }

  sharp(req.file.buffer)
    .png({ quality: 60 })

    // .toFile(`./images/${day}-${month}-${year}${Date.now()}.${extension}`)
    .toFile(`./images/${randomName}.${extension}`)
    .then((data) => {
      req.file.name = `${randomName}.${extension}`;
      console.log('freussite', data, req.file);
      next();
    })
    .catch((err) => {
      console.log('Error', err);
      next(err);
    });
};
