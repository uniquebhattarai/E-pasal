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

// Disable ETags for dynamic REST API so responses always return 200 OK with fresh data instead of 304 Not Modified
app.set("etag", false);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      const staticAllowed = [
        "http://localhost:5173",
        "https://e-pasal-two.vercel.app",
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Allow exact matches or any local network origin (localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      const isLocalNetwork = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(
        origin
      );

      // Allow any Vercel domain (production domain or preview deployments)
      const isVercel =
        origin.endsWith(".vercel.app") || origin.includes("vercel.app");

      if (staticAllowed.includes(origin) || isLocalNetwork || isVercel) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect to  Cloudinary
cloudinaryConnect();

// Disable HTTP caching for all API routes to ensure always fresh 200 OK responses
app.use("/api/v1", (req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

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
