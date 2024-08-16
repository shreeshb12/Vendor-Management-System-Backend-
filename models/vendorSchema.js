const mongoose=require('mongoose');
const db=require('../config/mongoose')

// Define the main Vendor schema
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Vendor's name
  contactDetails: { type: String }, // Contact information (JSON string)
  address: { type: String }, // Physical address (JSON string)
  vendorCode: { type: String, required: true, unique: true }, // Unique identifier
  onTimeDeliveryRate: { type: Number, default: 0 }, // On-time delivery percentage
  qualityRatingAvg: { type: Number, default: 0 }, // Average quality rating
  averageResponseTime: { type: Number, default: 0 }, // Average response time
  fulfillmentRate: { type: Number, default: 0 } // Fulfillment rate percentage
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;