import { AppError } from '../middlewares/errorHandler';

/**
 * Crea un objeto Error con un statusCode asociado para que
 * el errorHandler global responda con el código HTTP correcto.
 */
export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};
