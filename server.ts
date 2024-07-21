import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config();

import errorHandler from './src/middleware/error';
import searches from './src/routes/repositories';

const port = process.env.PORT || 8000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', searches);

// Error handling
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
