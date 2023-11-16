const express = require('express')
const router = express.Router()
const { isAdmin, isSignin } = require("../middlewares/authMiddleware");
const { createProductController,
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
    placeOrderController, } = require('../controllers/productController');
const formidableMiddleware = require('express-formidable');

// create a new product
router.post("/create-product", isSignin, isAdmin, formidableMiddleware(), createProductController);

// get all products
router.get("/get-product", getProductController);

// get single product using slug(product-slug)
router.get("/get-product/:slug", getSingleProductController);

// get single product image by product id
router.get("/product-photo/:pid", productPhotoController);

// delete product by product id
router.delete("/delete-product/:pid", deleteProductController);

// update product by product id
router.put("/update-product/:pid", isSignin, isAdmin, formidableMiddleware(), updateProductController);

// filter products
router.post("/product-filters", productFilterController);

// products count
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductController);

// similar product
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController);

// place order
router.post("/place-order", isSignin, placeOrderController);


module.exports = router;