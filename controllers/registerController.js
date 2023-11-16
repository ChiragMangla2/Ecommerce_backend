const { hashPassword, comparePassword } = require("../helpers/authHelper");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// register new user controller
const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address, secretQuestion } = req.body;
        if (!name || !email || !password || !phone || !address || !secretQuestion) {
            return res.status(500).send({ message: "Empty field are not allowed." });
        }

        // user exist
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already exist"
            })
        }

        // register
        const hashedPassword = await hashPassword(password);

        // save user
        const newUser = new userModel({ name, email, password: hashedPassword, phone, address, secretQuestion });

        const user = await newUser.save();

        return res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error: error
        })
    }
}

// login Controller
const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Email and Password is required"
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        // token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).send({
            success: true,
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Login",
            error: error
        })
    }
}

// forgot password
const forgotPasswordController = async (req, res) => {
    try {
        const { email, secretQuestion, newPassword } = req.body;
        if (!email || !secretQuestion || !newPassword) {
            return res.status(400).send({ message: "All fields are required", success: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Wrong Email or Answer", success: false });
        }


        if (user.secretQuestion == secretQuestion) {
            const hashed = await hashPassword(newPassword);
            await userModel.findByIdAndUpdate(user._id, { password: hashed });
            return res.status(200).send({
                success: true,
                message: "Password Reset Successfully!"
            })
        }
        else {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

// test controller
const testController = (req, res) => {
    res.send("Protected Route");
}

// update user details
const updateProfileController = async (req, res) => {
    try {

        const { name, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({ error: "Password is required and 6 characters long" })
        }

        const newHashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: newHashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })

        return res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while updating profile",
            error
        })
    }
}

// get user all orders
const getOrderController = async (req, res) => {
    try {
        const order = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")

        return res.status(200).json(order)
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while Getting orders",
            error
        })
    }
}

// get all users orders
const getAllOrderController = async (req, res) => {
    try {
        const order = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name")
            .sort({ createdAt: "-1" })

        return res.status(200).json(order)
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while Getting orders",
            error
        })
    }
}

// update order status controller
const updateOrderStatusController = async (req, res) => {
    try {
        console.log("here");

        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        return res.json({
            success: true,
            orders
        })

    } catch (error) {
        console.log(error);
        return res.status.send({
            success: false,
            message: "Error whiile updating order stautus",
            error
        })
    }
}

// get all users for admin
const getAllUsers = async (req, res) => {
    try {

        const data = await userModel.find(
            { role: { $lte: 0 } }
        ).select("-password").select("-secretQuestion").sort({createdAt : -1});

        if (data) {
            return res.status(200).send({
                success: true,
                message: "Get all users successfully",
                data
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something wrong",
            error
        })
    }
}

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    testController,
    updateProfileController,
    getOrderController,
    getAllOrderController,
    updateOrderStatusController,
    getAllUsers
}