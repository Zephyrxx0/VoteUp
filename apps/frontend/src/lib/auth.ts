import { initializeFirebase, isFirebaseConfigured, getFirebaseApp } from './firebase';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  linkWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  type User 
} from 'firebase/auth';

let auth: ReturnType<typeof getAuth> | null = null;

function getFirebaseAuth() {
  if (!auth && isFirebaseConfigured()) {
    const app = getFirebaseApp();
    if (app) {
      auth = getAuth(app);
    }
  }
  return auth;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAnonymous: boolean;
}

export type AuthStateListener = (state: AuthState) => void;
const listeners = new Set<AuthStateListener>();

function notifyListeners(state: AuthState) {
  listeners.forEach(listener => listener(state));
}

export function onAuthChange(listener: AuthStateListener) {
  listeners.add(listener);
  const firebaseAuth = getFirebaseAuth();
  
  if (!firebaseAuth) {
    listener({ user: null, loading: false, isAnonymous: false });
    return () => listeners.delete(listener);
  }
  
  const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    notifyListeners({
      user,
      loading: false,
      isAnonymous: user?.isAnonymous ?? false,
    });
  });
  
  return () => {
    listeners.delete(listener);
    unsubscribe();
  };
}

export async function signInAnon(): Promise<{ user: User | null; error: Error | null }> {
  const firebaseAuth = getFirebaseAuth();
  
  if (!firebaseAuth) {
    console.log('[Auth] Firebase not configured - creating anonymous session locally');
    return { user: null, error: null };
  }
  
  try {
    const result = await signInAnonymously(firebaseAuth);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function linkGoogleAccount(): Promise<{ user: User | null; error: Error | null }> {
  const firebaseAuth = getFirebaseAuth();
  
  if (!firebaseAuth) {
    return { user: null, error: new Error('Firebase not configured') };
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export function getCurrentUser(): User | null {
  const firebaseAuth = getFirebaseAuth();
  return firebaseAuth?.currentUser ?? null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isConfigured(): boolean {
  return isFirebaseConfigured();
}