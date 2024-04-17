const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const recipeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'RecipeImages',
        allowedFormats: ['jpg', 'png'],
        public_id: (req, file) => 'recipe_' + new Date().toISOString() + '_' + file.originalname
    },
});


const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ProfileImages',
        allowedFormats: ['jpg', 'png'],
        public_id: (req, file) => 'profile_' + req.user.id
    },
});

const recipeParser = multer({ storage: recipeStorage });
const profileParser = multer({ storage: profileStorage });


module.exports = {
    cloudinary,
    recipeParser,
    profileParser
};
