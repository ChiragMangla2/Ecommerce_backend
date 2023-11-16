const express = require('express')
const { isAdmin, isSignin } = require('../middlewares/authMiddleware')
const {createCategoryController,
    updateCategoryController, 
    getAllCategoryController, 
    getSingleCategoryController, 
    deleteCategoryController} = require('../controllers/categoryController')

const router = express.Router()

// create category
router.post('/create-category', isSignin, isAdmin, createCategoryController)

// update category
router.put('/update-category/:id', isSignin, isAdmin, updateCategoryController)

// get category
router.get('/get-category', getAllCategoryController)

// get single category
router.get('/single-category/:slug', getSingleCategoryController)

// delete single category
router.delete('/delete-category/:id', isSignin, isAdmin, deleteCategoryController)

module.exports = router