import { Request, Response, NextFunction, query } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  objectToQueryString,
  createError,
  saveToCache,
  fetchFromCache,
  mapAndCacheRepository,
} from '../utils/utils';

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

  if (Object.keys(queryParameters).length === 0) {
    return next(
      createError('Please include a name when searching for repositories', 400),
    );
  }

  delete Object.assign(queryParameters, { q: queryParameters.name }).name;

  const queryString = objectToQueryString(queryParameters);

  try {
    const cacheKey = queryString;
    const isCached = await fetchFromCache(cacheKey, res, next);
    if (isCached) return;

    const response = await fetch(
      `${GITHUB_ENDPOINT}/search/repositories?${queryString}`,
      {
        method: 'GET',
        headers: GITHUB_HEADERS,
      },
    );

    if (!response.ok) {
      if (response.status === 403) {
        const errorMessage = `GitHub API returned status code ${response.status} : API rate limit exceeded`;
        return next(createError(errorMessage, response.status));
      }
      return next(
        createError(
          `GitHub API returned status code ${response.status},`,
          response.status,
        ),
      );
    }

    const listOfRepositories = await response.json();

    if (!listOfRepositories || !listOfRepositories.items) {
      throw new Error(
        `There are no valid repositories with the name ${queryParameters.name}.`,
      );
    }

    const repositories = listOfRepositories.items.map(mapAndCacheRepository);

    saveToCache(cacheKey.toString(), JSON.stringify(repositories));

    res.status(200).json(repositories);
  } catch (error) {
    next(error);
  }
};

export const fetchById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.query.id as string;

  if (!id) {
    return next(
      createError('Please include an ID when searching for a repository', 400),
    );
  }

  try {
    const cacheKey = id;
    const isCached = await fetchFromCache(cacheKey, res, next);
    if (isCached) return;

    const response = await fetch(`${GITHUB_ENDPOINT}/repositories/${id}`, {
      method: 'GET',
      headers: GITHUB_HEADERS,
    });

    if (!response.ok) {
      return next(
        createError(
          `GitHub API returned status code ${response.status}`,
          response.status,
        ),
      );
    }

    const repository = await response.json();

    if (!repository) {
      throw new Error(`The repository with the id ${id} does not exist`);
    }

    saveToCache(cacheKey, JSON.stringify(repository));

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
  const queryParameters = req.query;

  if (queryParameters.id) {
    return fetchById(req, res, next);
  }
  const { owner, repository } = queryParameters;

  if (owner && repository) {
    try {
      const response = await fetch(
        `${GITHUB_ENDPOINT}/repos/${queryParameters.owner}/${queryParameters.repository}/readme`,
        {
          method: 'GET',
          headers: GITHUB_HEADERS,
        },
      );

      if (!response.ok) {
        return next(
          createError(
            `GitHub API returned status code ${response.status}`,
            response.status,
          ),
        );
      }

      const readme = await response.json();

      if (!readme) {
        throw new Error(
          `The repository with the name ${queryParameters.repository} does not have a readme`,
        );
      }

      res.status(200).json(readme);
    } catch (error) {
      next(error);
    }
  } else {
    return next(
      createError(
        'Please include both the owner name and the repository name or an ID when searching for a readme',
        400,
      ),
    );
  }
};
