import express from 'express';
import {
  fetchRepositories,
  fetchById,
  fetchReadme,
} from '../controllers/repositoryController';

const router = express.Router();

// Search for repositories
router.get('/repositories', fetchRepositories);

// Search repository by ID
router.get('/repositorydetails', fetchById);

// Search the readme of a repository
router.get('/readme', fetchReadme);

export default router;
