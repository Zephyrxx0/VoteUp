import express from 'express';
import type { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.ts';
import usersRouter from './routes/users.ts';
import geoRouter from './routes/geo.ts';
import checklistRouter from './routes/checklist.ts';
import pulseRouter from './routes/pulse.ts';
import aiComparisonRouter from './routes/ai-comparison.ts';

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', geoRouter);
app.use('/', checklistRouter);
app.use('/api/pulse', pulseRouter);
app.use('/', aiComparisonRouter);

export default app;
