import { getFirestore } from '../firebase';
import crypto from 'crypto';

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // timestamp
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedData<T>(collection: string, keyParts: string[]): Promise<T | null> {
  const hash = crypto.createHash('sha256').update(keyParts.join('_')).digest('hex');
  const firestore = getFirestore();
  
  try {
    const doc = await firestore.collection(collection).doc(hash).get();
    if (doc.exists) {
      const entry = doc.data() as CacheEntry<T>;
      if (entry.expiresAt > Date.now()) {
        return entry.data;
      } else {
        // Expired
        await doc.ref.delete();
      }
    }
  } catch (error) {
    console.error(`Cache get error for ${collection}:`, error);
  }
  
  return null;
}

export async function setCachedData<T>(collection: string, keyParts: string[], data: T, ttl = DEFAULT_TTL): Promise<void> {
  const hash = crypto.createHash('sha256').update(keyParts.join('_')).digest('hex');
  const firestore = getFirestore();
  
  try {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttl
    };
    await firestore.collection(collection).doc(hash).set(entry);
  } catch (error) {
    console.error(`Cache set error for ${collection}:`, error);
  }
}
