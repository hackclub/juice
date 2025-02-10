import dotenv from 'dotenv';
// Load environment variables before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import { router as videoRouter } from './routes/video.js';
import { router as userRouter } from './routes/user.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug route
app.get('/debug-routes', (req, res) => {
  console.log('Available routes:', app._router.stack);
  res.json({ message: 'Check server logs for routes' });
});

// Routes
app.use('/api/video', videoRouter);
app.use('/api/user', userRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Registered routes:');
  app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
  });
}); 