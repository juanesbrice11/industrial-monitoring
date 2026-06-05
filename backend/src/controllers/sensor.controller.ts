import { Request, Response, NextFunction } from 'express';
import * as sensorService from '../services/sensor.service';
import { createError } from '../utils/createError';
import { ApiResponse, Sensor } from '../types';

export const getAllSensors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sensors = await sensorService.getAllSensors();
    const response: ApiResponse<Sensor[]> = { success: true, data: sensors };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getZonesBySensor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw createError('El id del sensor debe ser un número válido', 400);
    }

    const zones = await sensorService.getZonesBySensor(id);
    const response: ApiResponse<typeof zones> = { success: true, data: zones };
    res.json(response);
  } catch (err) {
    next(err);
  }
};
