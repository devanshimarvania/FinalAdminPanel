const Category = require('../models/categoryModel');

const SubCategory = require('../models/subCategoryModel');

exports.addSubCategoryPage = async (req, res) => {

    try {

        const categories = await Category.find();

        return res.render('addSubCategory', {
            categories
        });

    } catch (err) {

        console.log(err);

        return res.redirect('back');

    }

}

exports.insertSubCategory = async (req, res) => {

    try {

        await SubCategory.create(req.body);

        req.flash('success', 'SubCategory Added Successfully');

        return res.redirect('/addSubCategory');

    } catch (err) {

        console.log(err);

        req.flash('error', 'SubCategory Not Added');

        return res.redirect('back');

    }

}