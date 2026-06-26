const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const imagePath = '/assets/images/product';

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDesc: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false // For the Trash feature
    }
}, {
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', imagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

productSchema.statics.uploadImage = multer({ storage: storage }).single('productImage');
productSchema.statics.imagePath = imagePath;

const Product = mongoose.model('Product', productSchema);
module.exports = Product;