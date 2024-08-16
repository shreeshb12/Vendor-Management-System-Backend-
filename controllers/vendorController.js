const Vendor=require('../models/vendorSchema');
// Create a new vendor
module.exports.createVendor = async (req, res) => {
    try {
      const newVendor = new Vendor(req.body);
      await newVendor.save();
      res.status(201).send(newVendor);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  // List all vendors
module.exports.getAllVendors = async (req, res) => {
    try {
      const vendors = await Vendor.find();
      res.status(200).send(vendors);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Retrieve a specific vendor's details
module.exports.getVendorById = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.vendorId);
      if (!vendor) {
        return res.status(404).send({ message: 'Vendor not found' });
      }
      res.status(200).send(vendor);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Update a vendor's details
module.exports.updateVendor = async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, req.body, { new: true, runValidators: true });
      if (!vendor) {
        return res.status(404).send({ message: 'Vendor not found' });
      }
      res.status(200).send(vendor);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  // Delete a vendor
module.exports.deleteVendor = async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndDelete(req.params.vendorId);
      if (!vendor) {
        return res.status(404).send({ message: 'Vendor not found' });
      }
      res.status(200).send({ message: 'Vendor deleted successfully' });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
// Calculate VendorPerformnce
  module.exports.getVendorPerformance = async (req, res) => {
    try {
      const vendorId = req.params.vendorId;
  
      // Find the vendor
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).send({ message: 'Vendor not found' });
      }
  
      // Calculate and update performance metrics
      await vendor.calculatePerformanceMetrics();
  
      // Respond with performance metrics
      res.status(200).send({
        onTimeDeliveryRate: vendor.onTimeDeliveryRate,
        qualityRatingAvg: vendor.qualityRatingAvg,
        averageResponseTime: vendor.averageResponseTime,
        fulfillmentRate: vendor.fulfillmentRate
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };
