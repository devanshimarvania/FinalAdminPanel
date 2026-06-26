const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const fs = require('fs');
const path = require('path');

exports.addProductPage = async (req, res) => {
    try {
        const categories = await Category.find();
        const subcategories = await SubCategory.find();
        return res.render('addProduct', { categories, subcategories });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.insertProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.productImage = Product.imagePath + '/' + req.file.filename;
        }
        await Product.create(req.body);
        req.flash('success', 'Product Added Successfully');
        return res.redirect('/addProduct');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Product Not Added');
        return res.redirect('back');
    }
};

exports.viewProductPage = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false })
            .populate('categoryId')
            .populate('subCategoryId');
        return res.render('viewProduct', { products });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.softDeleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
        req.flash('success', 'Product Moved to Trash');
        return res.redirect('/viewProduct');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.trashPage = async (req, res) => {
    try {
        const trashProducts = await Product.find({ isDeleted: true })
            .populate('categoryId')
            .populate('subCategoryId');
        return res.render('trash', { products: trashProducts });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.restoreProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: false });
        req.flash('success', 'Product Restored Successfully');
        return res.redirect('/trash');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.editProductPage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find();
        const subcategories = await SubCategory.find();
        return res.render('editProduct', { product, categories, subcategories });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};
exports.updateProduct = async (req, res) => {
    try {
        let oldProduct = await Product.findById(req.body.id);

        if (req.file) {
            let oldImagePath = path.join(__dirname, '..', 'public', oldProduct.productImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            req.body.productImage = Product.imagePath + '/' + req.file.filename;
        } else {
            // Keep the old image if no new file is uploaded
            req.body.productImage = oldProduct.productImage;
        }

        await Product.findByIdAndUpdate(req.body.id, req.body);
        req.flash('success', 'Product Updated Successfully');
        return res.redirect('/viewProduct');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        return res.redirect('back');
    }
};

exports.hardDeleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (product) {
            let imagePath = path.join(__dirname, '..', 'public', product.productImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
            await Product.findByIdAndDelete(req.params.id);
            req.flash('success', 'Product Permanently Deleted');
        }
        
        return res.redirect('/trash');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        return res.redirect('back');
    }
};