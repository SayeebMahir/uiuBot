import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    source: { type: String },
    chunks: [
      {
        chunkId: String,
        text: String,
        embedding: { type: [Number], index: '2dsphere' },
        metadata: Object,
      },
    ],
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
export default Document;

