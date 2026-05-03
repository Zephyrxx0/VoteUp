export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

const PBKDF2_ITERATIONS = 100_000;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function ensureCrypto(): Crypto {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is unavailable in this environment");
  }
  return globalThis.crypto;
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveUserKey(uid: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!uid.trim()) {
    throw new Error("UID is required for key derivation");
  }

  const cryptoApi = ensureCrypto();
  const keyMaterial = await cryptoApi.subtle.importKey(
    "raw",
    textEncoder.encode(uid),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return cryptoApi.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptSensitive(uid: string, data: string): Promise<EncryptedData> {
  const cryptoApi = ensureCrypto();
  const salt = cryptoApi.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = cryptoApi.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveUserKey(uid, salt);

  const encrypted = await cryptoApi.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    textEncoder.encode(data),
  );

  return {
    ciphertext: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

export async function decryptSensitive(uid: string, encrypted: EncryptedData): Promise<string> {
  const cryptoApi = ensureCrypto();
  const salt = fromBase64(encrypted.salt);
  const iv = fromBase64(encrypted.iv);
  const ciphertext = fromBase64(encrypted.ciphertext);

  const key = await deriveUserKey(uid, salt);

  const decrypted = await cryptoApi.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext,
  );

  return textDecoder.decode(decrypted);
}
