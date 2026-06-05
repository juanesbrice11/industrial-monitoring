import { TipoLectura } from '../types';

/** Tipos de lectura válidos. */
export const TIPOS_LECTURA: TipoLectura[] = [
  'TEMPERATURA',
  'PRESION',
  'VIBRACION',
  'FLUJO',
];

/** Rangos válidos de valorUmbral según el tipo de lectura. */
export const RANGOS_UMBRAL: Record<TipoLectura, { min: number; max: number }> = {
  TEMPERATURA: { min: 1, max: 500 },
  PRESION: { min: 1, max: 1000 },
  VIBRACION: { min: 1, max: 200 },
  FLUJO: { min: 1, max: 1000 },
};
