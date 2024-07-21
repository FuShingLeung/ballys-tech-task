export interface Owner {
  html_url: string;
}

export interface Repository {
  id: number;
  full_name: string;
  name: string;
  html_url: string;
  forks: number;
}

export interface CustomError extends Error {
  status?: number;
}

export interface GitHubResponse {}
