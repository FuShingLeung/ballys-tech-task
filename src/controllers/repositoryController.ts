import { Request, Response, NextFunction, query } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import { CustomError, Repository } from '../interfaces/interfaces';
import { objectToQueryString } from '../utils/utils';

const { GITHUB_ENDPOINT, GITHUB_API_TOKEN } = process.env;

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

  const response = await fetch(
    `${GITHUB_ENDPOINT}/search/repositories?${queryString}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.github+json',
        Authorization: GITHUB_API_TOKEN,
      } as Record<string, string>,
    },
  );

  const listOfRepositories = await response.json();

  if (!listOfRepositories) {
    throw new Error(
      `The repository with the name ${queryParameters.name} does not exist`,
    );
  }

  const repositories = listOfRepositories.items.map(
    (repository: Repository) => ({
      id: repository.id,
      full_name: repository.full_name,
      html_url: repository.html_url,
    }),
  );

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

  const response = await fetch(`${GITHUB_ENDPOINT}/repositories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
      Authorization: GITHUB_API_TOKEN,
    } as Record<string, string>,
  });

  const repository = await response.json();

  if (!repository) {
    throw new Error(`The repository with the id ${id} does not exist`);
  }

  res.status(200).json(repository);
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

  const response = await fetch(
    `${GITHUB_ENDPOINT}/repos/${owner}/${repository}/readme`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.github+json',
        Authorization: GITHUB_API_TOKEN,
      } as Record<string, string>,
    },
  );

  const readme = await response.json();

  if (!readme) {
    throw new Error(
      `The repository with the name ${repository} does not have a readme`,
    );
  }

  res.status(200).json(readme);
};
