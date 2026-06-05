import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const notFound = (req: Request, res: Response): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `La ruta ${req.method} ${req.originalUrl} no existe en este servidor`,
    data: null,
  };

  res.status(404).json(response);
};
