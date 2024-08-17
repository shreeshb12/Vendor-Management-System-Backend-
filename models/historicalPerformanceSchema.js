const mongoose = require('mongoose');
const Vendor=require('../models/vendorSchema');
const HistoricalPerformanceSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  date: { type: Date, required: true },
  onTimeDeliveryRate: { type: Number, required: true },
  qualityRatingAvg: { type: Number, required: true },
  averageResponseTime: { type: Number, required: true },
  fulfillmentRate: { type: Number, required: true }
});

HistoricalPerformanceSchema.methods.updateHistoricalPerformance = async function(vendorId) {
  console.log(vendorId);
  try {
    // Find the vendor
    
    const vendor = await Vendor.findById(vendorId);
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Use current metrics directly from the vendor model
    const onTimeDeliveryRate = vendor.onTimeDeliveryRate;
    const qualityRatingAvg = vendor.qualityRatingAvg;
    const averageResponseTime = vendor.averageResponseTime;
    const fulfillmentRate = vendor.fulfillmentRate;
    
    // Create a historical performance record
    const historicalPerformance = new this.constructor({
      vendor: vendorId,
      date: new Date(), // Set the current date or specify as needed
      onTimeDeliveryRate,
      qualityRatingAvg,
      averageResponseTime,
      fulfillmentRate
    });
    
    await historicalPerformance.save();
  } catch (err) {
    console.error('Error updating historical performance:', err);
  }
};

const HistoricalPerformance = mongoose.model('HistoricalPerformance', HistoricalPerformanceSchema);

module.exports = HistoricalPerformance;