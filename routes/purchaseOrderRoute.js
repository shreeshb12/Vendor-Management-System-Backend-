const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

// POST /purchase-orders: Create a purchase order
router.post('/', purchaseOrderController.createPurchaseOrder);

// GET /purchase-orders: List all purchase orders with an option to filter by vendor
router.get('/', purchaseOrderController.getAllPurchaseOrders);

// GET /purchase-orders/:poId: Retrieve details of a specific purchase order
router.get('/:poId', purchaseOrderController.getPurchaseOrderById);

// PUT /purchase-orders/:poId: Update a purchase order
router.put('/:poId', purchaseOrderController.updatePurchaseOrder);

// DELETE /purchase-orders/:poId: Delete a purchase order
router.delete('/:poId', purchaseOrderController.deletePurchaseOrder);

// POST /purchase-orders/:poId/acknowledge: Acknowledge a purchase order
router.post('/:poId/acknowledge', purchaseOrderController.acknowledgePurchaseOrder);

module.exports = router;

