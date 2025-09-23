import crypto from 'crypto';
import { env } from '../config/env.js';

// Custom encryption key and initialization vector (IV)
const ENCRYPTION_KEY = env.encryptionKey || '12345678901234567890123456789012'; // exactly 32 bytes for AES-256
const IV_LENGTH = 16; // 16 bytes for AES

// Custom email encryption function
export function encryptEmail(email) {
    try {
        // Generate a random IV for each encryption
        const iv = crypto.randomBytes(IV_LENGTH);

        // Create cipher with our custom key and IV
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

        // Encrypt the email
        let encrypted = cipher.update(email, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Combine IV and encrypted data (we need IV for decryption)
        const combined = iv.toString('hex') + ':' + encrypted;

        // Log in development
        if (env.nodeEnv !== 'production') {
            console.log('\x1b[35m%s\x1b[0m', `Email encrypted: ${email} → ${combined}`);
        }

        return combined;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Email encryption failed');
    }
}

// Custom email decryption function
export function decryptEmail(encryptedData) {
    try {
        // Split IV and encrypted data
        const [ivHex, encrypted] = encryptedData.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        // Create decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

        // Decrypt the email
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // Log in development
        if (env.nodeEnv !== 'production') {
            console.log('\x1b[36m%s\x1b[0m', `Email decrypted: ${encryptedData} → ${decrypted}`);
        }

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Email decryption failed');
    }
}

// Function to validate encryption/decryption
export function testEmailEncryption(email) {
    const encrypted = encryptEmail(email);
    const decrypted = decryptEmail(encrypted);
    const success = email === decrypted;

    if (env.nodeEnv !== 'production') {
        console.log('\x1b[33m%s\x1b[0m', `
Encryption Test:
Original: ${email}
Encrypted: ${encrypted}
Decrypted: ${decrypted}
Success: ${success}
        `);
    }

    return success;
}

export default {
    encryptEmail,
    decryptEmail,
    testEmailEncryption
};