const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require('./routes/auth.js');
const userRoute = require('./routes/users.js');
const productRoute = require('./routes/products.js');
const cartRoute = require('./routes/cart.js');
const orderRoute = require('./routes/orders.js');

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();



mongoose.connect(process.env.MONGO_DB_URL)
        .then( () => console.log("Mongo DB connection successfull!"))
        .catch((err => {
            console.log(err);
        }));

// All API Route goes here
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});