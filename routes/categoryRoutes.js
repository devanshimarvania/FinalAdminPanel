const express = require('express');

const router = express.Router();

const categoryCtl = require('../controllers/categoryController');

const auth = require('../middleware/authMiddleware');

const Category = require('../models/categoryModel');

router.get(
    '/addCategory',
    auth.checkAuthentication,
    categoryCtl.addCategoryPage
);

router.post(
    '/insertCategory',
    auth.checkAuthentication,
    categoryCtl.insertCategory
);



module.exports = router;