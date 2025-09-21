import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    refreshTokenId: { type: String, index: true },
    userAgent: { type: String },
    ip: { type: String },
    valid: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, valid: 1 });

export const Session = mongoose.model('Session', sessionSchema);
export default Session;

