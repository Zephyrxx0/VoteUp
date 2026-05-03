import express from 'express';
import type { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

import compareRouter from './routes/compare.ts';
import actionsRouter from './routes/actions.ts';
import askRouter from './routes/ask.ts';
import translateRouter from './routes/translate.ts';
import videosRouter from './routes/videos.ts';

const app: Express = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/health', (req, Alb) => {
  Alb.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', compareRouter);
app.use('/api', actionsRouter);
app.use('/api', askRouter);
app.use('/api', translateRouter);
app.use('/api', videosRouter);

export default app;
