// utils.js

// Function to calculate rent price
const calculateRentPrice = (productPrice, rentDuration, rentUnit) => {
    let pricePerUnit = 0;
  
    // Calculate price per unit based on rent unit
    switch (rentUnit) {
      case 'hourly':
        pricePerUnit = productPrice / 24; // Assuming 24 hours in a day
        break;
      case 'daily':
        pricePerUnit = productPrice;
        break;
      case 'weekly':
        pricePerUnit = productPrice * 7; // Assuming 7 days in a week
        break;
      case 'monthly':
        pricePerUnit = productPrice * 30; // Assuming 30 days in a month
        break;
      default:
        throw new Error('Invalid rent unit');
    }
  
    // Calculate total rent price
    const totalRentPrice = pricePerUnit * rentDuration;
  
    return totalRentPrice;
  };
  
  export { calculateRentPrice };
  