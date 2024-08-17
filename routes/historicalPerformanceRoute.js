const express = require('express');
const router = express.Router();
const vendorPerformanceController = require('../controllers/historicalPerformanceController');

// GET /vendors/:vendorId/performance: Retrieve performance metrics for a vendor
router.get('/:vendorId', vendorPerformanceController.getHistoricalPerformance);

module.exports = router;