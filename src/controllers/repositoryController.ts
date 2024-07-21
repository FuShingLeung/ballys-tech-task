import { Request, Response, NextFunction, query } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import { CustomError, Repository } from '../interfaces/interfaces';
import { objectToQueryString } from '../utils/utils';
import redisClient from '../config/redis';

const { GITHUB_ENDPOINT, GITHUB_API_TOKEN } = process.env;

const GITHUB_HEADERS = {
  'Content-Type': 'application/vnd.github+json',
  Authorization: GITHUB_API_TOKEN,
} as Record<string, string>;

export const fetchRepositories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const queryParameters = req.query;
  delete Object.assign(queryParameters, { q: queryParameters.name }).name;

  const queryString = objectToQueryString(queryParameters);

  if (!queryString) {
    const error: CustomError = new Error(
      'Please include a name when searching for repositories',
    );
    error.status = 400;
    return next(error);
  }

  try {
    const cacheKey = queryString;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const response = await fetch(
      `${GITHUB_ENDPOINT}/search/repositories?${queryString}`,
      {
        method: 'GET',
        headers: GITHUB_HEADERS,
      },
    );

    if (!response.ok && response.status === 403) {
      console.log(response);
      const errorData = await response.json();
      const errorMessage = `GitHub API returned status code ${response.status} : API rate limit exceeded`;

      const error: CustomError = new Error(errorMessage);
      error.status = response.status;
      console.log(error);
      next(error);
    }

    const listOfRepositories = await response.json();

    if (!listOfRepositories) {
      throw new Error(
        `The repository with the name ${queryParameters.name} does not exist`,
      );
    }

    const repositories: Repository[] = [];
    listOfRepositories.items.forEach((repository: Repository) => {
      const cacheKey = repository.id.toString();
      redisClient.set(cacheKey, JSON.stringify(repository));

      const newRepository: Repository = {
        id: repository.id,
        full_name: repository.full_name,
        html_url: repository.html_url,
        name: repository.name,
      };
      repositories.push(newRepository);
    });

    await redisClient.set(cacheKey, JSON.stringify(repositories));

    res.status(200).json(repositories);
  } catch (error) {
    next(`error: ${error}`);
  }
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

  try {
    const cacheKey = id.toString();
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const response = await fetch(`${GITHUB_ENDPOINT}/repositories/${id}`, {
      method: 'GET',
      headers: GITHUB_HEADERS,
    });

    const repository = await response.json();

    if (!repository) {
      throw new Error(`The repository with the id ${id} does not exist`);
    }

    await redisClient.set(cacheKey, JSON.stringify(repository));

    res.status(200).json(repository);
  } catch (error) {
    next(error);
  }
};

export const fetchReadme = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { owner, repository } = req.query;

  if (!owner || !repository) {
    const error: CustomError = new Error(
      'Please include both the owner name and the repository name when searching for a readme',
    );
    error.status = 400;
    return next(error);
  }

  try {
    const response = await fetch(
      `${GITHUB_ENDPOINT}/repos/${owner}/${repository}/readme`,
      {
        method: 'GET',
        headers: GITHUB_HEADERS,
      },
    );

    const readme = await response.json();

    if (!readme) {
      throw new Error(
        `The repository with the name ${repository} does not have a readme`,
      );
    }

    res.status(200).json(readme);
  } catch (error) {
    next(error);
  }
};
