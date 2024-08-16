const PurchaseOrder = require('../models/purchaseOrder');

// Create a new purchase order
module.exports.createPurchaseOrder = async (req, res) => {
  try {
    const newOrder = new PurchaseOrder(req.body);
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
    const order = await PurchaseOrder.findByIdAndUpdate(req.params.poId, req.body, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).send({ message: 'Purchase order not found' });
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send(error);
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
