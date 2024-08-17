const express=require('express');
const router=express.Router();

const PurchaseOrder = require('../models/purchaseOrderSchema');
const Vendor=require('../models/vendorSchema');
const HistoricalPerformance=require('../models/historicalPerformanceSchema')

// Create a new purchase order
module.exports.createPurchaseOrder = async (req, res) => {
  // console.log(req.body);
  try {
    console.log(req.body);
    const newOrder = new PurchaseOrder(req.body);
    console.log(newOrder);
    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (error) {
    res.status(400).send(error);
  }
};

// List all purchase orders with an option to filter by vendor
module.exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const filter = req.query.vendor ? { vendor: req.query.vendor } : {};
    const orders = await PurchaseOrder.find(filter).populate('vendor');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Retrieve details of a specific purchase order
module.exports.getPurchaseOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.poId).populate('vendor');
    if (!order) {
      return res.status(404).send({ message: 'Purchase order not found' });
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a purchase order
module.exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    const updateData = req.body;
   
    // Find the PO to update
    const purchaseOrder = await PurchaseOrder.findById(poId);
    if (!purchaseOrder) {
        return res.status(404).json({ message: 'Purchase Order not found' });
    }
    
    // Update the PO with the provided data
    Object.assign(purchaseOrder, updateData);
    await purchaseOrder.save();
    
    // Get the vendor associated with the PO
    const vendor = await Vendor.findById(purchaseOrder.vendor);

    // store the matrix data before updating
    const previousMetrics = {
      onTimeDeliveryRate: vendor.onTimeDeliveryRate,
      qualityRatingAvg: vendor.qualityRatingAvg,
      averageResponseTime: vendor.averageResponseTime,
      fulfillmentRate: vendor.fulfillmentRate,
    };

    // If status changes to 'completed', recalculate metrics
    if (updateData.status === 'completed') {
        await vendor.calculateOnTimeDeliveryRate(poId);
        await vendor.calculateQualityRatingAvg(poId);
        await vendor.calculateFulfillmentRate(poId);
    }
    // If acknowledgmentDate is provided, recalculate average response time
    if (updateData.acknowledgmentDate) {
        await vendor.calculateAverageResponseTime(poId);
    }
    
    // Check if metrics have changed
    const metricsChanged =
    vendor.onTimeDeliveryRate !== previousMetrics.onTimeDeliveryRate ||
    vendor.qualityRatingAvg !== previousMetrics.qualityRatingAvg ||
    vendor.averageResponseTime !== previousMetrics.averageResponseTime ||
    vendor.fulfillmentRate !== previousMetrics.fulfillmentRate;

  // Update the historical performance matrix only if metrics have changed
  if (metricsChanged) {
    const historicalPerformance = new HistoricalPerformance({
      vendor: vendor._id,
      date: new Date(),
      onTimeDeliveryRate: vendor.onTimeDeliveryRate,
      qualityRatingAvg: vendor.qualityRatingAvg,
      averageResponseTime: vendor.averageResponseTime,
      fulfillmentRate: vendor.fulfillmentRate,
    });

    await historicalPerformance.save();}
    res.status(200).json({ message: 'Purchase Order updated successfully', purchaseOrder });
} catch (error) {
    res.status(500).json({ message: 'Error updating Purchase Order', error });
}
};

// Delete a purchase order
module.exports.deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndDelete(req.params.poId);
    if (!order) {
      return res.status(404).send({ message: 'Purchase order not found' });
    }
    res.status(200).send({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Acknowledge a purchase order
module.exports.acknowledgePurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;

    // Find the purchase order and update acknowledgment date
    const order = await PurchaseOrder.findById(poId);
    if (!order) {
      return res.status(404).send({ message: 'Purchase order not found' });
    }

    order.acknowledgmentDate = new Date();
    await order.save();

    // Update vendor's performance metrics
    const vendor = await Vendor.findById(order.vendor);
    if (vendor) {
      await vendor.calculateAverageResponseTime(poId);
    }
    
    //update the historical performance matrix
    await HistoricalPerformance.updateHistoricalPerformance(vendor._id);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

