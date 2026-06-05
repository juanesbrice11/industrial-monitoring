import { Request, Response, NextFunction } from 'express';
import * as zoneService from '../services/zone.service';
import { createError } from '../utils/createError';
import { ApiResponse, Zone } from '../types';

export const getAllZones = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const zones = await zoneService.getAllZones();
    const response: ApiResponse<typeof zones> = { success: true, data: zones };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getZoneById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw createError('El id de la zona debe ser un número válido', 400);
    }

    const zone = await zoneService.getZoneById(id);
    const response: ApiResponse<Zone> = { success: true, data: zone };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getActiveSensorsByZone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw createError('El id de la zona debe ser un número válido', 400);
    }

    const sensors = await zoneService.getActiveSensorsByZone(id);
    const response: ApiResponse<typeof sensors> = {
      success: true,
      data: sensors,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};
