const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true,  immutable: true},
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderDate: { type: Date, required: true },
  deliveryDate: { type: Date },
  items: { type: Map, of: String }, // Example: { "item1": "description", "item2": "description" }
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
  qualityRating: { type: Number, default: null },
  issueDate: { type: Date, default: Date.now },
  acknowledgmentDate: { type: Date }
});

// Hook to generate PO Number before saving
PurchaseOrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const vendor = await this.model('Vendor').findById(this.vendor);
      if (vendor) {
        const vendorPrefix = vendor.name.substring(0, 2).toUpperCase();
        const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
        this.poNumber = `${vendorPrefix}-${todayDate}`;
      } else {
        return next(new Error('Vendor not found'));
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

module.exports = PurchaseOrder;