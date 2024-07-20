export interface Owner {
  html_url: string;
}

export interface Repository {
  id: number;
  full_name: string;
  html_url: string;
}

export interface CustomError extends Error {
  status?: number;
}
