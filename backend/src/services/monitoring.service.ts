import { prisma } from '../config/prisma';
import { createError } from '../utils/createError';
import {
  CreateMonitoringDto,
  UpdateMonitoringDto,
  EstadoMonitoreo,
} from '../types';

/**
 * Devuelve todos los monitoreos. Si se pasa un status,
 * filtra por ese estado.
 */
export const getAllMonitorings = async (status?: EstadoMonitoreo) => {
  return prisma.monitoring.findMany({
    where: status ? { estado: status } : undefined,
  });
};

/**
 * Crea un monitoreo verificando que el sensor y la zona existan
 * y que la combinación sensor-zona no esté ya asignada.
 */
export const createMonitoring = async (data: CreateMonitoringDto) => {
  const sensor = await prisma.sensor.findUnique({
    where: { id: data.sensorId },
  });
  if (!sensor) {
    throw createError(`No existe un sensor con id ${data.sensorId}`, 404);
  }

  const zone = await prisma.zone.findUnique({ where: { id: data.zoneId } });
  if (!zone) {
    throw createError(`No existe una zona con id ${data.zoneId}`, 404);
  }

  const existing = await prisma.monitoring.findUnique({
    where: {
      sensorId_zoneId: { sensorId: data.sensorId, zoneId: data.zoneId },
    },
  });
  if (existing) {
    throw createError(
      `El sensor ${data.sensorId} ya está asignado a la zona ${data.zoneId}`,
      400
    );
  }

  return prisma.monitoring.create({
    data: {
      ...data,
      fechaInstalacion: new Date(data.fechaInstalacion),
    },
  });
};

/**
 * Actualiza un monitoreo existente. Solo modifica los campos
 * presentes en data (valorUmbral y/o estado).
 */
export const updateMonitoring = async (
  id: number,
  data: UpdateMonitoringDto
) => {
  const monitoring = await prisma.monitoring.findUnique({ where: { id } });
  if (!monitoring) {
    throw createError(`No existe un monitoreo con id ${id}`, 404);
  }

  const updateData: UpdateMonitoringDto = {};
  if (data.valorUmbral !== undefined) updateData.valorUmbral = data.valorUmbral;
  if (data.estado !== undefined) updateData.estado = data.estado;

  return prisma.monitoring.update({ where: { id }, data: updateData });
};
