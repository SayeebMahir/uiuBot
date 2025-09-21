import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    metadata: { type: Object },
    threadId: { type: String, index: true },
  },
  { timestamps: true }
);

messageSchema.index({ threadId: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);
export default Message;

