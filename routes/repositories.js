import express from 'express';
import {
  fetchRepositories,
  fetchById,
} from '../controllers/repositoryController.js';

const router = express.Router();

// Search for repositories
router.get('/repositories', fetchRepositories);

// Search repository by ID
router.get('/repositorydetails', fetchById);

export default router;
