import express from 'express';
import { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import { NFIDAuth } from './src/utils/nfidIntegration';

const nfidAuth = new NFIDAuth();


// const compression = require('compression');

import { AppError } from './src/utils/appError';
import globalErrorHandler from './src/controllers/errorController';
import authRouter from './src/routes/authRoutes'
import walletRouter from './src/routes/walletRoutes';
import crossChainRouter from './src/routes/crossChainRoutes';
import liquidityPoolRouter from './src/routes/liquidityPoolRoutes';

const app: Application = express();

// Global MiddleWares

// Security HTTP Headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// compress responses
// app.use(compression());

interface CustomRequest extends Request {
  requestTime: string; // Add your custom property here
}

// Test middleware
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});



app.use('/api/auth', authRouter);

// Authentication middleware
app.use(async (req, res, next) => {
  if (await nfidAuth.isAuthenticated()) {
      next();
  } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
  }
});


// Routes
app.use('/api/wallet', walletRouter);
app.use('/api/liquidityPool', liquidityPoolRouter);
app.use('/api/crossChain', crossChainRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

app.use(globalErrorHandler);

export default app;
