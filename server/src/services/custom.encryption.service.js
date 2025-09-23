// Custom encryption implementation without using crypto library

// Our custom substitution table (a-z, A-Z, 0-9, @, .)
const substitutionTable = {
    'a': 'K', 'b': 'P', 'c': 'X', 'd': 'R', 'e': 'M',
    'f': 'N', 'g': 'T', 'h': 'W', 'i': 'Y', 'j': 'F',
    'k': 'U', 'l': 'I', 'm': 'Q', 'n': 'S', 'o': 'V',
    'p': 'H', 'q': 'J', 'r': 'C', 's': 'D', 't': 'L',
    'u': 'A', 'v': 'E', 'w': 'B', 'x': 'G', 'y': 'O',
    'z': 'Z', '@': '#', '.': '$',
    'A': 'k', 'B': 'p', 'C': 'x', 'D': 'r', 'E': 'm',
    'F': 'n', 'G': 't', 'H': 'w', 'I': 'y', 'J': 'f',
    'K': 'u', 'L': 'i', 'M': 'q', 'N': 's', 'O': 'v',
    'P': 'h', 'Q': 'j', 'R': 'c', 'S': 'd', 'T': 'l',
    'U': 'a', 'V': 'e', 'W': 'b', 'X': 'g', 'Y': 'o',
    'Z': 'z', '0': '5', '1': '7', '2': '9', '3': '4',
    '4': '3', '5': '0', '6': '8', '7': '1', '8': '6',
    '9': '2'
};

// Create reverse table for decryption
const reverseTable = {};
for (let char in substitutionTable) {
    reverseTable[substitutionTable[char]] = char;
}

// Custom shift value for additional security
const SHIFT_VALUE = 3;

export function myCustomEncrypt(email) {
    if (!email) return '';

    // Step 1: Apply character substitution
    let substituted = '';
    for (let char of email) {
        substituted += substitutionTable[char] || char;
    }

    // Step 2: Shift characters
    let shifted = '';
    for (let i = 0; i < substituted.length; i++) {
        let pos = (i + SHIFT_VALUE) % substituted.length;
        shifted += substituted[pos];
    }

    // Step 3: Add a marker to identify this is encrypted
    const encrypted = 'ENC:' + shifted;

    // Log in development
    if (process.env.NODE_ENV !== 'production') {
        console.log('\x1b[35m%s\x1b[0m', `
Custom Encryption:
Original: ${email}
Substituted: ${substituted}
Shifted: ${shifted}
Final: ${encrypted}
        `);
    }

    return encrypted;
}

export function myCustomDecrypt(encryptedEmail) {
    if (!encryptedEmail || !encryptedEmail.startsWith('ENC:')) {
        return encryptedEmail;
    }

    // Remove the marker
    const encrypted = encryptedEmail.slice(4);

    // Step 1: Unshift characters
    let unshifted = '';
    for (let i = 0; i < encrypted.length; i++) {
        let pos = (i - SHIFT_VALUE + encrypted.length) % encrypted.length;
        unshifted += encrypted[pos];
    }

    // Step 2: Reverse substitution
    let decrypted = '';
    for (let char of unshifted) {
        decrypted += reverseTable[char] || char;
    }

    // Log in development
    if (process.env.NODE_ENV !== 'production') {
        console.log('\x1b[36m%s\x1b[0m', `
Custom Decryption:
Encrypted: ${encryptedEmail}
Unshifted: ${unshifted}
Decrypted: ${decrypted}
        `);
    }

    return decrypted;
}

// Function to test the encryption
export function testCustomEncryption(email) {
    console.log('\x1b[33m%s\x1b[0m', '=== Testing Custom Encryption ===');
    const encrypted = myCustomEncrypt(email);
    const decrypted = myCustomDecrypt(encrypted);
    console.log(`
Original: ${email}
Encrypted: ${encrypted}
Decrypted: ${decrypted}
Success: ${email === decrypted}
    `);
    return email === decrypted;
}

export default {
    myCustomEncrypt,
    myCustomDecrypt,
    testCustomEncryption
};