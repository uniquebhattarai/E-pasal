const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Customer", "Admin"],
    default: "Customer",
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
   additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"profile",
    },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
   token:{
        type:String,
        default: null,
    },
    resetPasswordExpires:{
        type:Date,
    }
});

module.exports = mongoose.model("User", userSchema);
