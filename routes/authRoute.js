const express = require("express");
const router = express.Router();
const {  registerController, 
    loginController, 
    testController, 
    forgotPasswordController, 
    updateProfileController, 
    getOrderController, 
    getAllOrderController, 
    updateOrderStatusController, 
    getAllUsers } = require("../controllers/registerController");

const { isSignin, isAdmin } = require("../middlewares/authMiddleware");

// testing route
router.get('/', (req, res) => {
    res.json({ "message": "Auth api is working!" });
});

// register user
router.post('/register', registerController);

// login user
router.post('/login', loginController);

// user dashboard - protected route
router.get('/user-auth', isSignin, (req, res) => {
    res.status(200).send({ ok: true });
});

// forget-password route
router.post('/forgot-password', forgotPasswordController);

// check is admin route
router.get('/admin-auth', isSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// update profile
router.put("/profile", isSignin, updateProfileController);

// get order
router.get("/get-order", isSignin, getOrderController);

// get all order to admin
router.get("/all-order", isSignin, isAdmin, getAllOrderController);

// order status update
router.put("/order-status/:orderId", isSignin, isAdmin, updateOrderStatusController);

// get all users
router.get("/all-users", isSignin, isAdmin, getAllUsers);

module.exports = router