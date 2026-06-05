import { prisma } from '../config/prisma';
import { createError } from '../utils/createError';

/** Devuelve todos los sensores. */
export const getAllSensors = async () => {
  return prisma.sensor.findMany();
};

/** Devuelve un sensor por id. Lanza 404 si no existe. */
export const getSensorById = async (id: number) => {
  const sensor = await prisma.sensor.findUnique({ where: { id } });

  if (!sensor) {
    throw createError(`No existe un sensor con id ${id}`, 404);
  }

  return sensor;
};

/**
 * Devuelve todas las zonas monitoreadas por un sensor,
 * considerando solo los monitoreos en estado ACTIVO.
 * Lanza 404 si el sensor no existe.
 */
export const getZonesBySensor = async (id: number) => {
  const sensor = await prisma.sensor.findUnique({
    where: { id },
    include: {
      monitorings: {
        where: { estado: 'ACTIVO' },
        include: { zone: true },
      },
    },
  });

  if (!sensor) {
    throw createError(`No existe un sensor con id ${id}`, 404);
  }

  return sensor.monitorings.map((monitoring) => monitoring.zone);
};
