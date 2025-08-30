const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");


const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");



const Database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudiary");


dotenv.config();


Database.connect();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect to Cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment",paymentRoutes);

// Test Server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your E-Pasal Server is up and running",
  });
});

// Setting up Port
const PORT = process.env.PORT || 4000;

// Start Server
app.listen(PORT, () => {
  console.log(`E-Pasal app is listening at PORT ${PORT}`);
});
