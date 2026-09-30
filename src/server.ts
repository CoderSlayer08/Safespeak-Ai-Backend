import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import sosRoutes from './routes/sosRoutes';
import contactRoutes from './routes/contactRoutes';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8765';
app.use(cors({ origin: [frontendUrl, 'http://localhost:8765'] }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SafeHelp AI backend is running'
  });
});

app.get('/', (req, res) => {
  res.send('SafeHelp AI Backend is running! Access the API at /api/health');
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
