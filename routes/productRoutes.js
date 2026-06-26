const express = require('express');
const router = express.Router();
const productCtl = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const Product = require('../models/productModel');

router.get('/addProduct', auth.checkAuthentication, productCtl.addProductPage);
router.post('/insertProduct', auth.checkAuthentication, Product.uploadImage, productCtl.insertProduct);
router.get('/viewProduct', auth.checkAuthentication, productCtl.viewProductPage);
router.get('/editProduct/:id', auth.checkAuthentication, productCtl.editProductPage);
router.post('/updateProduct/:id', auth.checkAuthentication, Product.uploadImage, productCtl.updateProduct);

// Trash Routes
router.get('/deleteProduct/:id', auth.checkAuthentication, productCtl.softDeleteProduct);
router.get('/trash', auth.checkAuthentication, productCtl.trashPage);
router.get('/restoreProduct/:id', auth.checkAuthentication, productCtl.restoreProduct);
router.get('/hardDeleteProduct/:id', auth.checkAuthentication, productCtl.hardDeleteProduct);

module.exports = router;