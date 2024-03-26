import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pictures: [String], // Array of picture URLs
  status: {
    type: String,
    enum: ["SOLD", "ONRETAIL", "ONRENT", "BOUGHT"],
    default: "ONRETAIL",
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, 
  },
  {timestamps:true}
);

// Sell schema
const sellSchema = new Schema({
  product_ID: { type: Schema.Types.ObjectId, ref: 'Product' },
  user_ID: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['SOLD', 'ONRETAIL', 'DISCARDED'], default: 'ONRETAIL' }
});

// Rent schema
const rentSchema = new Schema({
  product_ID: { type: Schema.Types.ObjectId, ref: 'Product' },
  user_ID: { type: Schema.Types.ObjectId, ref: 'User' },
  rent: { type: Number }, // Duration in days, weeks, or months
  price: { type: Number },
  status: { type: String, enum: ['RENTED', 'AVAILABLE', 'CANCELLED'], default: 'AVAILABLE' }
});

// Auction schema
const auctionSchema = new Schema({
  product_ID: { type: Schema.Types.ObjectId, ref: 'Product' },
  user_ID: { type: Schema.Types.ObjectId, ref: 'User' },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number },
  endDate: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE' }
});


// buyProducts schema
const buyProductsSchema = new Schema({
  product_ID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user_ID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now }
});


const BuyProducts = mongoose.model('BuyProducts', buyProductsSchema);
const Product = mongoose.model('Product', productSchema);
const Sell = mongoose.model('Sell', sellSchema);
const Rent = mongoose.model('Rent', rentSchema);
const Auction = mongoose.model('Auction', auctionSchema);

export { Product, Sell, Rent, Auction, BuyProducts};

