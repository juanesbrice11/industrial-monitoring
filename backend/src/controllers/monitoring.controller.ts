import { Request, Response, NextFunction } from 'express';
import * as monitoringService from '../services/monitoring.service';
import { createError } from '../utils/createError';
import {
  ApiResponse,
  CreateMonitoringDto,
  EstadoMonitoreo,
  TipoLectura,
} from '../types';
import { TIPOS_LECTURA, RANGOS_UMBRAL } from '../utils/umbral';

export const getAllMonitorings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;

    if (status && status !== 'ACTIVO' && status !== 'PAUSADO') {
      throw createError(
        `Estado inválido: ${status}. Los valores permitidos son ACTIVO o PAUSADO`,
        400
      );
    }

    const monitorings = await monitoringService.getAllMonitorings(
      status as EstadoMonitoreo | undefined
    );
    const response: ApiResponse<typeof monitorings> = {
      success: true,
      data: monitorings,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const createMonitoring = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      sensorId,
      zoneId,
      fechaInstalacion,
      tipoLectura,
      valorUmbral,
      estado,
    } = req.body;

    const missing: string[] = [];
    if (sensorId === undefined || sensorId === null) missing.push('sensorId');
    if (zoneId === undefined || zoneId === null) missing.push('zoneId');
    if (fechaInstalacion === undefined || fechaInstalacion === null)
      missing.push('fechaInstalacion');
    if (tipoLectura === undefined || tipoLectura === null)
      missing.push('tipoLectura');
    if (valorUmbral === undefined || valorUmbral === null)
      missing.push('valorUmbral');

    if (missing.length > 0) {
      throw createError(
        `Faltan campos obligatorios: ${missing.join(', ')}`,
        400
      );
    }

    if (isNaN(new Date(fechaInstalacion).getTime())) {
      throw createError(
        'El campo fechaInstalacion debe ser una fecha válida (YYYY-MM-DD)',
        400
      );
    }

    if (estado === undefined || estado === null) {
      throw createError(
        'El campo estado es obligatorio (ACTIVO o PAUSADO)',
        400
      );
    }

    if (estado !== 'ACTIVO' && estado !== 'PAUSADO') {
      throw createError('El campo estado debe ser ACTIVO o PAUSADO', 400);
    }

    if (!TIPOS_LECTURA.includes(tipoLectura)) {
      throw createError(
        'El campo tipoLectura debe ser TEMPERATURA, PRESION, VIBRACION o FLUJO',
        400
      );
    }

    if (typeof valorUmbral !== 'number' || valorUmbral <= 0) {
      throw createError('El campo valorUmbral debe ser un número mayor a 0', 400);
    }

    const { min, max } = RANGOS_UMBRAL[tipoLectura as TipoLectura];
    if (valorUmbral < min || valorUmbral > max) {
      throw createError(
        `El valorUmbral para ${tipoLectura} debe estar entre ${min} y ${max}`,
        400
      );
    }

    const monitoring = await monitoringService.createMonitoring(
      req.body as CreateMonitoringDto
    );
    const response: ApiResponse<typeof monitoring> = {
      success: true,
      data: monitoring,
      message: 'Monitoreo creado correctamente',
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateMonitoring = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw createError('El id del monitoreo debe ser un número válido', 400);
    }

    const { valorUmbral, estado } = req.body;
    if (valorUmbral === undefined && estado === undefined) {
      throw createError(
        'Debes enviar al menos valorUmbral o estado para actualizar',
        400
      );
    }

    const monitoring = await monitoringService.updateMonitoring(id, {
      valorUmbral,
      estado,
    });
    const response: ApiResponse<typeof monitoring> = {
      success: true,
      data: monitoring,
      message: 'Monitoreo actualizado correctamente',
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};
