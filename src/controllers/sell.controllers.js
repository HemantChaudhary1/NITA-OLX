import {asyncHandler} from "../utils/asyncHandler.js";
import {Product,Sell,BuyProducts} from "../models/product.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const toSell = asyncHandler( async (req,res) =>{

  try {
    const { title, description, price, pictures} = req.body; // Extract data from request body
    const user_ID = req.user._id;

    // Create a new product instance
    const newProduct = new Product({
      title,
      description,
      price,
      pictures,
      status: "ONRETAIL", // Set the default status for a new product as "ONRETAIL"
    });
      
       // Check if the 'avatar' field exists in req.files and has at least one file
    if (!req.files?.avatar || req.files.avatar.length === 0) {
      throw new ApiError(400, "Avatar file is required");
    }
      
      const avatarLocalPath = req.files?.avatar[0]?.path;  
       
       if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
       }

      const avatar = await uploadOnCloudinary(avatarLocalPath)
       
       if (!avatar) {
        const errorMessage = req.files?.avatar[0]?.originalname
          ? "Error uploading avatar file"
          : "Avatar file is required";
        throw new ApiError(400, errorMessage);
      }

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Create a new sell instance
    const newSell = new Sell({
      product_ID: savedProduct._id, // Link the product with the sell entry
      user_ID, // User ID who is selling the product
      status: "ONRETAIL", // Set the default status for a new sell entry as "ONRETAIL"
      pictures: avatar.url,
    });

    // Save the sell entry to the database
    const savedSell = await newSell.save();


     // Create a new BuyProducts instance
     const newBuyProduct = new BuyProducts({
      product_ID: savedProduct._id,
      user_ID,
      quantity: 1, // Adjust as needed
      totalPrice: price, // Assuming totalPrice is the same as price when adding for sale
    });

    await newBuyProduct.save();

    // Update user's myProducts array
    const user = await User.findById(user_ID);
    user.myProducts.push(savedProduct._id);
    await user.save();

    res.status(201).json({ success: true, message: 'Product added for sale.', product: savedProduct, sell: savedSell });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product for sale.', error: error.message });
  }        
}
)


export  {toSell};