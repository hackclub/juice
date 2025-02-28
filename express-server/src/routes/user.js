import express from 'express';
import { getUserData } from '../controllers/userController.js';

const router = express.Router();

// Add a basic test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'User route is working' });
});

router.get('/', (req, res, next) => {
  console.log('User route hit');
  getUserData(req, res).catch(next);
});

export { router }; 