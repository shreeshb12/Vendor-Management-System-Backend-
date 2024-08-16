const express = require('express');
const router = express.Router();
const vendorPerformanceController = require('../controllers/vendorPerformanceController');

// GET /vendors/:vendorId/performance: Retrieve performance metrics for a vendor
router.get('/:vendorId/performance', vendorPerformanceController.getVendorPerformance);

module.exports = router;