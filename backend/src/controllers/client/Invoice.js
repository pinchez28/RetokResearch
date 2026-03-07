import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  invoiceNumber: { type: String, required: true, unique: true },
  subtotal: { type: Number, required: true },
  vat: { type: Number, required: true },
  total: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Invoice', invoiceSchema);
