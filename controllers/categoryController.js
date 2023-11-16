const slugify = require("slugify");
const categoryModel = require("../models/categoryModule");

const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exisits"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(401).send({ message: "Category new name is required" })
        }
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        if (updatedCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Updated Successfully!"
            })
        }
        return res.status(400).send({
            success: false,
            message: "Something wrong happened!"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
    }
}

const getAllCategoryController = async (req, res) => {
    try {

        const allCategory = await categoryModel.find();

        if (allCategory) {
            return res.status(200).send({
                success: true,
                message: "All Categories Get Successfully!",
                allCategory
            })
        }
        return res.status(400).send({
            success: false,
            message: "No Category Present"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories"
        })
    }
}

const getSingleCategoryController = async (req, res) => {
    try {

        const {slug} = req.params;
        const singleCategory = await categoryModel.findOne({slug});

        if (singleCategory) {
            return res.status(200).send({
                success: true,
                message: "Single Category Get Successfully!",
                singleCategory
            })
        }
        return res.status(400).send({
            success: false,
            message: "No Category Present"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories"
        })
    }
}

const deleteCategoryController = async (req, res) => {
    try {

        const {id} = req.params;
        const singleCategory = await categoryModel.findByIdAndDelete(id);

        if (singleCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Deleted Successfully!",
                singleCategory
            })
        }
        return res.status(400).send({
            success: false,
            message: "Category is not deleted"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
    }
}

module.exports = {
    createCategoryController,
    updateCategoryController,
    getAllCategoryController,
    getSingleCategoryController,
    deleteCategoryController
}