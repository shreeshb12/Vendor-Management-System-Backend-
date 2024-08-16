const express=require('express');
const vendorController = require('../controllers/vendorController');
const router=express.Router();

// POST /vendors: Create a new vendor
router.post('/', vendorController.createVendor);

// GET /vendors: List all vendors
router.get('/', vendorController.getAllVendors);
// GET /vendors/:vendorId: Retrieve a specific vendor's details
router.get('/:vendorId', vendorController.getVendorById);

// PUT /vendors/:vendorId: Update a vendor's details
router.put('/:vendorId', vendorController.updateVendor);

// DELETE /vendors/:vendorId: Delete a vendor
router.delete('/:vendorId', vendorController.deleteVendor);

// GET /vendors/:vendorId/performance: Retrieve performance metrics for a vendor
router.get('/:vendorId/performance', vendorController.getVendorPerformance);

module.exports = router;