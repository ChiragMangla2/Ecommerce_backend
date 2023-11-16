const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    products:[{
        type: mongoose.ObjectId,
        ref: "Products"
    }],
    buyer:{
        type: mongoose.ObjectId,
        ref: "user"
    },
    payment:{
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process","Processing","Shipping", "Deliverd","Cancel"]
    }
},{timestamps:true});

module.exports = mongoose.model('Order', orderSchema);