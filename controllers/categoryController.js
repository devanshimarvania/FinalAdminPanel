const Category = require('../models/categoryModel');

exports.addCategoryPage = (req, res) => {
    return res.render('addCategory');
};

exports.insertCategory = async (req, res) => {
    try {
        await Category.create(req.body);
        req.flash('success', 'Category Added Successfully');
        return res.redirect('/addCategory');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Category Not Added');
        return res.redirect('back');
    }
};