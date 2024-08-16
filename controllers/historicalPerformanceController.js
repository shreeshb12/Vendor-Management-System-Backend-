const Vendor = require('../models/vendor');
const PurchaseOrder = require('../models/purchaseOrderSchema'); // Ensure this model is defined correctly

// Calculate and retrieve vendor performance metrics
exports.getVendorPerformance = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Find the vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).send({ message: 'Vendor not found' });
    }

    // Get all purchase orders for the vendor
    const orders = await PurchaseOrder.find({ vendor: vendorId });

    if (orders.length === 0) {
      const emptyMetrics = {
        onTimeDeliveryRate: 0,
        qualityRatingAvg: 0,
        averageResponseTime: 0,
        fulfillmentRate: 0
      };
      return res.status(200).send(emptyMetrics);
    }

    // Calculate on-time delivery rate
    const onTimeDeliveries = orders.filter(order => order.deliveryDate && order.deliveryDate <= order.orderDate).length;
    const onTimeDeliveryRate = (onTimeDeliveries / orders.length) * 100;

    // Calculate average quality rating
    const qualityRatings = orders.filter(order => order.qualityRating !== null).map(order => order.qualityRating);
    const qualityRatingAvg = qualityRatings.length > 0 ? (qualityRatings.reduce((acc, rating) => acc + rating, 0) / qualityRatings.length) : 0;

    // Calculate average response time
    const responseTimes = orders.filter(order => order.acknowledgmentDate).map(order => (order.acknowledgmentDate - order.issueDate) / (1000 * 60 * 60)); // in hours
    const averageResponseTime = responseTimes.length > 0 ? (responseTimes.reduce((acc, time) => acc + time, 0) / responseTimes.length) : 0;

    // Calculate fulfillment rate
    const fulfilledOrders = orders.filter(order => order.status === 'completed' && !order.qualityRating); // Assuming no issues if qualityRating is not provided
    const fulfillmentRate = (fulfilledOrders.length / orders.length) * 100;

    // Update vendor with calculated metrics
    vendor.onTimeDeliveryRate = onTimeDeliveryRate;
    vendor.qualityRatingAvg = qualityRatingAvg;
    vendor.averageResponseTime = averageResponseTime;
    vendor.fulfillmentRate = fulfillmentRate;
    await vendor.save();

    // Respond with performance metrics
    res.status(200).send({
      onTimeDeliveryRate,
      qualityRatingAvg,
      averageResponseTime,
      fulfillmentRate
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
