import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import loanRoutes from './routes/loan.routes';
import applicantRoutes from './routes/applicant.routes';
import loanTypeRoutes from './routes/loan-type.routes';
import auditLogRoutes from './routes/audit-log.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Loan Portal API is running' });
});

app.use('/auth', authRoutes);
app.use('/loans', loanRoutes);
app.use('/applicants', applicantRoutes);
app.use('/loan-types', loanTypeRoutes);
app.use('/audit-logs', auditLogRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV}`);
});

export default app;
