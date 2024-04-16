const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your account details
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'RecipeImages', // The name of the folder in Cloudinary
        allowedFormats: ['jpg', 'png'], // Supported file types
        public_id: (req, file) => new Date().toISOString() + '_' + file.originalname // Use date and original filename as public id
    },
});

const parser = multer({ storage });

// Export the configured parser to be used in your routes
module.exports = {
    cloudinary,
    parser
};
