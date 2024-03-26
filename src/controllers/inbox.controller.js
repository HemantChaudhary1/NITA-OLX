import { User, Product, Sell, Rent, Auction, BuyProducts } from '../models'; // Import your models
import jwt from 'jsonwebtoken'; // Import JWT for token verification

const getInbox = async (req, res) => {
  try {
    // Verify JWT token to get user information
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken._id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user owns any products
    const ownedProducts = await Product.find({ owner: userId });
    if (ownedProducts.length > 0) {
      // User owns products, so they are considered a seller
      const userRole = 'seller';

      // Handle actions for seller
      if (req.body.action === 'accept') {
        // Implement accept logic here
        const productID = product._id; // Accessing the _id of the product

        const product = await Product.findById(productID);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product status or perform other actions
        product.status = 'SOLD'; // For example, set the status to 'SOLD'
        await product.save();

        // Delete other requests for the same product
        // await Sell.deleteMany({ product_ID: productId, _id: { $ne: req.body.sellId } }); // Assuming sellId is sent in the request

        return res.status(200).json({ message: 'Product sold successfully' });

      } 
      else if (req.body.action === 'cancel') {
        // Implement cancel logic here
      }    else if (req.body.action === 'cancel') {
        // Implement cancel logic here
      } else if (req.body.action === 'sendOTP') {
        // Implement send OTP logic here
      }
      // Handle other seller actions as needed

      // Return appropriate response
      return res.status(200).json({ message: 'Action completed successfully' });
    } else {
      // User does not own any products, so they are considered a buyer
      const userRole = 'buyer';

      // Handle actions for buyer
      if (req.body.action === 'cancel') {
        // Implement cancel logic here
      } else if (req.body.action === 'enterOTP') {
        // Implement OTP entry logic here
      }
      // Handle other buyer actions as needed

      // Return appropriate response
      return res.status(200).json({ message: 'Action completed successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export  {getInbox};
