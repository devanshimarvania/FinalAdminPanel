const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    subCategoryName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    }

}, {
    timestamps: true
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;