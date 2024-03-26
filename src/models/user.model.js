import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    myProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
    ],
    inboxProducts: [
        {
          buyer: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
          },
          seller: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
          },
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product", // Reference to the Product model
          },
          isAccepted : Boolean,
          OTP : {type:Number}
          
        },
      ],
  },
  { timestamps: true }
);

// PASSWORD ENCRYPTION BEFORE SAVING PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  console.log("ACCESS_TOKEN_SEC : ", process.env.ACCESS_TOKEN_SECRET);
  console.log("ACCESS_TOKEN_EXP : ", process.env.ACCESS_TOKEN_EXPIRY);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      enrollmentNumber: this.enrollmentNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
