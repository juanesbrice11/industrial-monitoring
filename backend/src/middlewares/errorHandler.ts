import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: err.message || 'Error interno del servidor',
    data: null,
  };

  res.status(statusCode).json(response);
};
