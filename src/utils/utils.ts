import { Request, Response, NextFunction } from 'express';
import { CustomError, Repository } from '../interfaces/interfaces';
import redisClient from '../config/redis';

export const objectToQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
    )
    .join('&');
};

export const createError = (message: string, status: number) => {
  const error: CustomError = new Error(message);
  error.status = status;
  return error;
};

export const saveToCache = (cacheKey: string, cacheData: string) => {
  redisClient.set(cacheKey, cacheData);
};

export const fetchFromCache = async (
  cacheKey: string,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return true;
    }
    return false;
  } catch (error) {
    next(error);
    return true;
  }
};

export const mapAndCacheRepository = (repository: Repository) => {
  saveToCache(repository.id.toString(), JSON.stringify(repository));
  return {
    id: repository.id,
    full_name: repository.full_name,
    html_url: repository.html_url,
    name: repository.name,
  };
};
