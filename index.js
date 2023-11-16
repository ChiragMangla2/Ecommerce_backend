const express = require('express')
const app = express()
require("./db/conn");
const cors = require("cors")
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoute");
 
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))