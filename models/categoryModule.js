const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true
    }
});

const categoryModel = mongoose.model('Category', categorySchema);
//Export the model
module.exports = categoryModel