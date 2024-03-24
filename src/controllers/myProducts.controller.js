import { asyncHandler } from "../utils/asyncHandler.js";
import { Product, Rent, BuyProducts, Sell } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

const getMyProducts = asyncHandler(async (req, res) => {
  try {
    const user_ID = req.user._id;

    // Fetch products for sale
    const productsForSale = await Sell.find({ status: "ONRETAIL", user_ID });

    // Fetch rented products
    const rentedProducts = await Rent.find({ user_ID });

    // Fetch bought products
    const boughtProducts = await BuyProducts.find({ user_ID });

    // Fetch sold products
    const soldProducts = await Sell.find({ user_ID, status: "SOLD" });

    res.status(200).json({
      success: true,
      myProducts: {
        productsForSale,
        rentedProducts,
        boughtProducts,
        soldProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching my products.",
      error: error.message,
    });
  }
});

export { getMyProducts };
