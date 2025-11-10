// Core
import express from 'express';

// Libraries
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';

// Load environment variables from the .env file
dotenv.config();

// Check if JWT_SECRET is defined; exit the app if not
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Initialize the Express server
const app = express();

// Define the server port (default to 3001 if not specified)
const PORT = process.env.PORT || 3001;

// =======================
// Middlewares
// =======================
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Routes
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('Backend is running');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
