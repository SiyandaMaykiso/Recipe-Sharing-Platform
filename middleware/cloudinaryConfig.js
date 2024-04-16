const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your account details
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for recipe images
const recipeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'RecipeImages',
        allowedFormats: ['jpg', 'png'],
        public_id: (req, file) => 'recipe_' + new Date().toISOString() + '_' + file.originalname
    },
});

// Set up Cloudinary storage for profile images
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ProfileImages',
        allowedFormats: ['jpg', 'png'],
        public_id: (req, file) => 'profile_' + req.user.id // or some other unique identifier
    },
});

const recipeParser = multer({ storage: recipeStorage });
const profileParser = multer({ storage: profileStorage });

// Export the configured parsers to be used in your routes
module.exports = {
    cloudinary,
    recipeParser,
    profileParser
};
