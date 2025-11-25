import mongoose from 'mongoose';

const clientMessageSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    service: { type: String },
  },
  { timestamps: true }
);

const ClientMessage = mongoose.model('ClientMessage', clientMessageSchema);

export default ClientMessage;
