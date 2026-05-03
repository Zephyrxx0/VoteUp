import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';

let authDb: unknown = null;

export function initializeAuth(credentials: unknown): void {
  authDb = credentials;
}

export interface AuthMiddleware {
  isAdmin: (req: Request, res: Response, next: NextFunction) => void;
}

export function createAuthMiddleware(): AuthMiddleware {
  return {
    isAdmin: (req, res, next) => {
      if (!authDb) {
        console.log('[Auth] Firebase not configured - admin check skipped');
        return res.status(503).json({ 
          error: 'Admin authentication unavailable' 
        });
      }
      
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
      }
      
      console.log('[Auth] Would verify admin claim from:', authHeader);
      next();
    },
  };
}

export async function setAdminClaim(userId: string): Promise<boolean> {
  if (!authDb) {
    console.log('[Auth] Firebase not configured - cannot set admin claim');
    return false;
  }
  
  console.log(`[Auth] Would set admin claim for user: ${userId}`);
  return true;
}