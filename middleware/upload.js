const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure cloudinary with the credentials
cloudinary.config({
  cloud_name: 'ddi4nldf0',
  api_key: '763859427461943',
  api_secret: 'LrFazDKoHAUrQW2ErVC7Fa0dc94'
});

// Set up the storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RecipeImages',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => {
      const timestamp = Date.now();
      return file.fieldname + '-' + timestamp; // use whatever naming convention you like
    },
  },
});

// Configure multer to use Cloudinary for storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit; adjust as needed
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('Only .png, .jpg and .jpeg formats are allowed!'), false);
    }
  },
});

module.exports = upload;
