const fs = require("fs");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModule");
const slugify = require("slugify");
const orderModel = require("../models/orderModel");

const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;

        const { photo } = req.files

        // validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" })
            case !description:
                return res.status(400).send({ error: "Description is Required" })
            case !price:
                return res.status(400).send({ error: "Price is Required" })
            case !category:
                return res.status(400).send({ error: "Category is Required" })
            case !quantity:
                return res.status(400).send({ error: "Quantity is Required" })
            case !photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo is Required and Should be less than 1MB" })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }


        const result = await products.save()

        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            result,
            path: photo.path
        });


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in creating product"
        })
    }
}

const getProductController = async (req, res) => {
    try {

        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Get products successfully",
            total_products: products.length,
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting products",
            error: error.message
        })
    }
}

const getSingleProductController = async (req, res) => {
    try {

        const products = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");

        res.status(200).send({
            success: true,
            message: "Get product successfully",
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting product",
            error: error.message
        })
    }
}

const productPhotoController = async (req, res) => {
    try {

        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting product images",
            error: error.message
        })
    }
}

const deleteProductController = async (req, res) => {
    try {

        const result = await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        if (result) {
            res.status(200).send({
                success: true,
                message: "Product deleted successfully!"
                , result
            })
        }
        else {
            return res.status(400).send({
                success: false,
                message: "Product not found!"
                , result
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error: error.message
        })
    }
}

const updateProductController = async (req, res) => {
    try {

        const { name, description, price, category, quantity } = req.fields;

        const { photo } = req.files;

        // validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" })
            case !description:
                return res.status(400).send({ error: "Description is Required" })
            case !price:
                return res.status(400).send({ error: "Price is Required" })
            case !category:
                return res.status(400).send({ error: "Category is Required" })
            case !quantity:
                return res.status(400).send({ error: "Quantity is Required" })
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo is Required and Should be less than 1MB" })
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        console.log(products);

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        res.status(201).send({
            success: true,
            message: "Product updated Successfully",
            products
        });


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while updating product",
            error: error.message
        })
    }
}

// get filtered products
const productFilterController = async (req, res) => {
    try {

        const { checked, radio } = req.body;
        const radioData = parseInt(radio);
        let args = {};
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radioData <= 99) {
            args.price = { $gte: radioData, $lte: (radioData + 10) };
        }
        if (radioData >= 100) {
            args.price = { $gte: radioData, $lte: (radioData + 8999) };
        }

        const products = await productModel.find(args);
        return res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while Filtering Products"
        });
    }
}

// get counted all products
const productCountController = async (req, res) => {
    try {

        const total = await productModel.find({}).count();
        return res.status(200).send({
            success: true,
            total
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in product count",
            error,
            success: false
        })
    }
}

// product list base on page
const productListController = async (req, res) => {
    try {

        const perPage = 9;
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });

        return res.status(200).send({
            success:true,
            products
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error in per page control",
            error
        })
    }
}

// search product
const searchProductController = async (req,res) => {
    try {
        
        const {keyword} = req.params;
        const result = await productModel.find({
            $or:[
                { name: { $regex: keyword, $options: "i"} },
                { description: { $regex: keyword, $options: "i"} }
            ]
        }).select("-photo")

        return res.json(result)
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error in searching Product!",
            error
        })
    }
}

// get related products
const relatedProductController = async (req,res) => {
    try {

        const {pid,cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        })
        .select("-photo").limit(4).populate("category");

        return res.status(200).send({
            success:true,
            products
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"error while geting related product",
            error
        })
    }
}

const productCategoryController = async (req,res) => {
    try {

        const category = await categoryModel.findOne({slug: req.params.slug});
        const products = await productModel.find({category}).select("-photo").populate("category");

        return res.status(200).send({
            success:true,
            category,
            products
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error while getting Products",
            error
        })
    }
}

const placeOrderController = async (req,res) => {
    try {

        const {cart, amount} = req.body;

        const order = new orderModel({
            products: cart,
            buyer: req.user._id,
            payment: amount
        });

        await order.save();

        return res.status(200).json({ok:true})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Order is not placed",
            error
        })
    }
}

module.exports = {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    placeOrderController
}