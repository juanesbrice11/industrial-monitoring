import { prisma } from '../config/prisma';
import { createError } from '../utils/createError';

/**
 * Devuelve todas las zonas incluyendo el conteo de sensores
 * activos (monitoreos en estado ACTIVO) en cada una.
 */
export const getAllZones = async () => {
  const zones = await prisma.zone.findMany({
    include: {
      monitorings: {
        where: { estado: 'ACTIVO' },
        select: { id: true },
      },
    },
  });

  return zones.map(({ monitorings, ...zone }) => ({
    ...zone,
    sensoresActivos: monitorings.length,
  }));
};

/** Devuelve una zona por id. Lanza 404 si no existe. */
export const getZoneById = async (id: number) => {
  const zone = await prisma.zone.findUnique({ where: { id } });

  if (!zone) {
    throw createError(`No existe una zona con id ${id}`, 404);
  }

  return zone;
};

/**
 * Devuelve todos los sensores de una zona (activos y pausados),
 * junto con el tipoLectura, valorUmbral y estado de su monitoreo.
 * Lanza 404 si la zona no existe.
 */
export const getSensorsByZone = async (id: number) => {
  const zone = await prisma.zone.findUnique({
    where: { id },
    include: {
      monitorings: {
        include: { sensor: true },
      },
    },
  });

  if (!zone) {
    throw createError(`No existe una zona con id ${id}`, 404);
  }

  return zone.monitorings.map((monitoring) => ({
    ...monitoring.sensor,
    monitoringId: monitoring.id,
    tipoLectura: monitoring.tipoLectura,
    valorUmbral: monitoring.valorUmbral,
    estado: monitoring.estado,
  }));
};
