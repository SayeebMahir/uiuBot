import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ['login', 'reset'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date },
  },
  { timestamps: true }
);

otpSchema.index({ userId: 1, purpose: 1, expiresAt: 1 });

export const Otp = mongoose.model('Otp', otpSchema);
export default Otp;

