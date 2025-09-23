import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { myCustomEncrypt, myCustomDecrypt } from '../services/custom.encryption.service.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      set: function (email) {
        // Store encrypted email using custom encryption
        this._plainEmail = email; // Keep plain email temporarily
        return myCustomEncrypt(email);
      },
      get: function (encryptedEmail) {
        try {
          // Decrypt email using custom decryption
          return myCustomDecrypt(encryptedEmail);
        } catch (err) {
          return encryptedEmail;
        }
      }
    },
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

