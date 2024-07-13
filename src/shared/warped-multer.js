const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = (dir = 'public', fileName = null) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const publicDirectory = path.join('src', dir);
      const avatarDirectory = path.join(publicDirectory, 'avatar');

      if (!fs.existsSync(publicDirectory)) {
        fs.mkdirSync(publicDirectory);
      }
      if (!fs.existsSync(avatarDirectory)) {
        fs.mkdirSync(avatarDirectory);
      }
      cb(null, avatarDirectory);
    },
    filename(req, file, cb) {
      cb(null, `${fileName || `${new Date().getTime()}--${file.originalname}`}`);
    },
  });
  return multer({ storage });
};
const uploadLogo = (dir = 'public', fileName = null) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const publicDirectory = path.join('src', dir);
      const avatarDirectory = path.join(publicDirectory, 'logo');

      if (!fs.existsSync(publicDirectory)) {
        fs.mkdirSync(publicDirectory);
      }
      if (!fs.existsSync(avatarDirectory)) {
        fs.mkdirSync(avatarDirectory);
      }
      cb(null, avatarDirectory);
    },
    filename(req, file, cb) {
      cb(null, `${fileName || `${new Date().getTime()}--${file.originalname}`}`);
    },
  });
  return multer({ storage });
};

const uploadContract = () => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const { id } = req.params;
      const publicPlacesDirectory = path.join('src', 'private', 'public-places');
      if (!fs.existsSync(publicPlacesDirectory)) {
        fs.mkdirSync(publicPlacesDirectory);
      }
      const publicPlaceDirectory = path.join(publicPlacesDirectory, id);
      if (!fs.existsSync(publicPlaceDirectory)) {
        fs.mkdirSync(publicPlaceDirectory);
      }
      cb(null, publicPlaceDirectory);
    },
    filename(req, file, cb) {
      cb(null, 'nouv-contrat.pdf');
    },
  });
  return multer({ storage });
};

module.exports = { upload, uploadContract, uploadLogo };
