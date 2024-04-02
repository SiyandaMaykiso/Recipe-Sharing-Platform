// Import multer
const multer = require('multer');

// Define storage options
const storage = multer.diskStorage({
  // Destination for files
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  // Add back the extension
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + file.originalname);
  },
});

// Upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

module.exports = upload;
