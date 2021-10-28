const multerConfig = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multerConfig.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, 'article' + Date.now() + '.' + extension);
    }
});

module.exports = multerConfig({storage: storage}).single('image');
