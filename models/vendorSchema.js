const mongoose=require('mongoose');
const db=require('../config/mongoose')
const { v4: uuidv4 } = require('uuid');
const PurchaseOrder=require('../models/purchaseOrderSchema');
// Define the main Vendor schema
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Vendor's name
  contactDetails: { type: String }, // Contact information (JSON string)
  address: { type: String }, // Physical address (JSON string)
  vendorCode: { type: String, required: true, unique: true,default:'889jhh',immutable: true}, // Unique identifier
  onTimeDeliveryRate: { type: Number, default: 0 }, // On-time delivery percentage
  qualityRatingAvg: { type: Number, default: 0 }, // Average quality rating
  averageResponseTime: { type: Number, default: 0 }, // Average response time
  fulfillmentRate: { type: Number, default: 0 } // Fulfillment rate percentage
});

// Pre-save hook to generate vendorCode
VendorSchema.pre('save', function (next) {
  if (this.isNew) {
    // Extract first 3 letters from the vendor name
    const namePart = this.name.substring(0, 3).toUpperCase();
    
    // Extract last digit from the phone number
    let phonePart = '';
    try {
      const contactDetails = JSON.parse(this.contactDetails);
      const phoneNumber = contactDetails.phone;
      phonePart = phoneNumber.slice(-4); // Get last 4 digit of phone number
    } catch (error) {
      console.error('Error parsing contactDetails:', error);
      phonePart = '0'; // Default value if parsing fails
    }
    
    // Construct vendor code
    this.vendorCode = `${namePart}${phonePart}`;
  }
  next();
});

// Custom methods to calculate and update performance metrics

// Calculate On-Time Delivery Rate
VendorSchema.methods.calculateOnTimeDeliveryRate = async function(poId) {
  try {
    // Find the specific PO to update the performance metrics
    const po = await PurchaseOrder.findById(poId);
    if (!po || po.status !== 'completed') return;

    // Calculate completed and on-time orders
    const completedOrders = await PurchaseOrder.find({ vendor: this._id, status: 'completed' });
    const onTimeOrders = completedOrders.filter(order => 
      order.deliveryDate && new Date(order.deliveryDate) <= new Date(order.acknowledgmentDate)
    );

    this.onTimeDeliveryRate = (onTimeOrders.length / completedOrders.length) * 100 || 0;
    await this.save();
  } catch (err) {
    console.error('Error calculating On-Time Delivery Rate:', err);
  }
};
// Calculate Quality Rating Avg
VendorSchema.methods.calculateQualityRatingAvg = async function(poId) {
  try {
    // Find the specific PO to update the performance metrics
    const po = await PurchaseOrder.findById(poId);
    if (!po || po.status !== 'completed' || po.qualityRating === null) return;

    // Calculate the average quality rating
    const completedOrders = await PurchaseOrder.find({ vendor: this._id, status: 'completed', qualityRating: { $ne: null } });
    const totalQualityRating = completedOrders.reduce((sum, order) => sum + order.qualityRating, 0);

    this.qualityRatingAvg = (totalQualityRating / completedOrders.length) || 0;
    await this.save();
  } catch (err) {
    console.error('Error calculating Quality Rating Average:', err);
  }
};
// Calculate Average Response Time
VendorSchema.methods.calculateAverageResponseTime = async function(poId) {
  try {
    // Find the specific PO to update the performance metrics
    const po = await PurchaseOrder.findById(poId);
    if (!po || !po.acknowledgmentDate) return;

    // Calculate the average response time
    const acknowledgedOrders = await PurchaseOrder.find({ vendor: this._id, acknowledgmentDate: { $ne: null } });
    const totalResponseTime = acknowledgedOrders.reduce((sum, order) => sum + (new Date(order.acknowledgmentDate) - new Date(order.issueDate)), 0);

    this.averageResponseTime = (totalResponseTime / acknowledgedOrders.length) || 0;
    await this.save();
  } catch (err) {
    console.error('Error calculating Average Response Time:', err);
  }
};
// Calculate Fulfillment Rate
VendorSchema.methods.calculateFulfillmentRate = async function(poId) {
  try {
    // Find the specific PO to update the performance metrics
    const po = await PurchaseOrder.findById(poId);
    if (!po) return;

    // Calculate the fulfillment rate
    const totalOrders = await PurchaseOrder.countDocuments({ vendor: this._id });
    const fulfilledOrders = await PurchaseOrder.countDocuments({ vendor: this._id, status: 'completed' });

    this.fulfillmentRate = totalOrders ? (fulfilledOrders / totalOrders) * 100 : 0;
    await this.save();
  } catch (err) {
    console.error('Error calculating Fulfillment Rate:', err);
  }
};


const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;