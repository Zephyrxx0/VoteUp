import { getFirebaseAuth as getAuth_, isFirebaseConfigured, getFirebaseApp } from './firebase';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  linkWithPopup,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  type AuthCredential,
  type User 
} from 'firebase/auth';
import { getUserProfile, updateUserProfile, type UserProfile } from './user-service';

function getFirebaseAuth() {
  return getAuth_();
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

export type MergeResolutionChoice = 'keep-cloud' | 'overwrite-local';

export interface UpgradeConflict {
  type: 'constituency-mismatch';
  localConstituency: string;
  cloudConstituency: string;
}

export interface UpgradeResult {
  user: User | null;
  error: Error | null;
  conflict?: UpgradeConflict;
}

function mergeUnique(values: string[] = [], incoming: string[] = []): string[] {
  return Array.from(new Set([...values, ...incoming]));
}

function extractConstituency(profile: UserProfile | null): string | null {
  if (!profile) return null;
  const value = (profile as UserProfile & { constituencyId?: unknown }).constituencyId;
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function mergeProfiles(localProfile: UserProfile | null, cloudProfile: UserProfile | null): Pick<UserProfile, 'history' | 'badges'> {
  return {
    history: mergeUnique(cloudProfile?.history, localProfile?.history),
    badges: mergeUnique(cloudProfile?.badges, localProfile?.badges),
  };
}

export async function upgradeToGoogle(
  resolutionChoice: MergeResolutionChoice = 'keep-cloud',
): Promise<UpgradeResult> {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    return { user: null, error: new Error('Firebase not configured') };
  }

  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) {
    return { user: null, error: new Error('No authenticated user to upgrade') };
  }

  const provider = new GoogleAuthProvider();
  const localProfile = await getUserProfile(currentUser.uid);

  try {
    const linked = await linkWithPopup(currentUser, provider);
    return { user: linked.user, error: null };
  } catch (caught) {
    const error = caught as Error & { code?: string };
    if (error.code !== 'auth/credential-already-in-use') {
      return { user: null, error };
    }

    const credential = GoogleAuthProvider.credentialFromError(caught as any) as AuthCredential | null;
    if (!credential) {
      return { user: null, error: new Error('Unable to recover Google credential from linking error') };
    }

    const signedIn = await signInWithCredential(firebaseAuth, credential);
    const googleUser = signedIn.user;
    const cloudProfile = await getUserProfile(googleUser.uid);

    const localConstituency = extractConstituency(localProfile);
    const cloudConstituency = extractConstituency(cloudProfile);

    if (
      localConstituency &&
      cloudConstituency &&
      localConstituency !== cloudConstituency &&
      resolutionChoice === 'keep-cloud'
    ) {
      return {
        user: googleUser,
        error: null,
        conflict: {
          type: 'constituency-mismatch',
          localConstituency,
          cloudConstituency,
        },
      };
    }

    const merged =
      resolutionChoice === 'overwrite-local'
        ? {
            history: mergeUnique(localProfile?.history, cloudProfile?.history),
            badges: mergeUnique(localProfile?.badges, cloudProfile?.badges),
          }
        : mergeProfiles(localProfile, cloudProfile);

    await updateUserProfile(googleUser.uid, merged);

    return { user: googleUser, error: null };
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
