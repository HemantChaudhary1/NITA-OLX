import { Product, Rent } from "../models/product.model";
import { calculateRentPrice } from "../utils/rentCalculation";

// Rent item controller function
const rentItem = async (req, res) => {
  try {
    const { title, description, price, pictures, rentDuration, rentUnit } = req.body; // Assuming the request body includes all necessary data
    const user_ID = req.user._id;   // authentication middleware that adds userId to req.user

    // Check if the product already exists
    let product = await Product.findOne({ title });

    if (!product) {
      // Create a new product if it doesn't exist
      product = new Product({
        title,
        description,
        price,
        pictures,
        status: 'ONRENT', // Set initial status to 'ONRENT'
        owner: user_ID,
      });
     
      /* 
       Code for Upload photo

      */
       

      // Save the new product
      await product.save();
    }

    // Calculate rent price based on product price, duration, and unit
    const rentPrice = calculateRentPrice(product.price, rentDuration, rentUnit);

    // Create a new rent record
    const newRent = new Rent({
      product_ID: product._id,
      user_ID: user_ID,
      rentDuration,
      rentUnit,
      price: rentPrice,
      status: 'RENTED', // Set initial status to 'RENTED'
    });

    // Save the rent record
    await newRent.save();

    res.status(200).json({ message: 'Item rented successfully', rent: newRent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { rentItem };
