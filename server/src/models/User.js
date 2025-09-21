import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    studentId: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: true },
    twoFactorSecret: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

export const User = mongoose.model('User', userSchema);
export default User;

