const express = require('express');

const router = express.Router();

const subCategoryCtl = require('../controllers/subCategoryController');

const auth = require('../middleware/authMiddleware');

router.get(
    '/addSubCategory',
    auth.checkAuthentication,
    subCategoryCtl.addSubCategoryPage
);

router.post(
    '/insertSubCategory',
    auth.checkAuthentication,
    subCategoryCtl.insertSubCategory
);

module.exports = router;