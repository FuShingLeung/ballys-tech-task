import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const { GITHUB_ENDPOINT, GITHUB_API_TOKEN } = process.env;

interface CustomError extends Error {
  status?: number;
}

export const fetchRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const name = req.query.name;

  if (!name) {
    const error: CustomError = new Error(
      'Please include a name when searching for repositories',
    );
    error.status = 400;
    return next(error);
  }

  const data = await fetch(`${GITHUB_ENDPOINT}/search/repositories?q=${name}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      Authorization: GITHUB_API_TOKEN,
    } as Record<string, string>,
  });

  const repositories = await data.json();

  if (!repositories) {
    throw new Error(`The repository with the name ${name} does not exist`);
  }

  res.status(200).json(repositories);
};

export const fetchById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.query.id;

  if (!id) {
    const error: CustomError = new Error(
      'Please include an ID when searching for a repository',
    );
    error.status = 400;
    return next(error);
  }

  const data = await fetch(`${GITHUB_ENDPOINT}/repositories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      Authorization: GITHUB_API_TOKEN,
    } as Record<string, string>,
  });

  const repository = await data.json();

  if (!repository) {
    throw new Error(`The repository with the id ${id} does not exist`);
  }

  res.status(200).json(repository);
};
