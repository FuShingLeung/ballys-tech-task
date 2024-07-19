import express from 'express';
import { fetchRepositories } from '../controllers/repositoryController.js';

const router = express.Router();

// Search for repositories
router.get('/repositories', fetchRepositories);

export default router;
