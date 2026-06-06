import { TipoLectura } from '../types';

/** Rango válido de valorUmbral, unidad y ejemplo según el tipo de lectura. */
export const RANGOS_UMBRAL: Record<
  TipoLectura,
  { min: number; max: number; unidad: string; ejemplo: string }
> = {
  TEMPERATURA: { min: 1, max: 500, unidad: '°C', ejemplo: '85.0' },
  PRESION: { min: 1, max: 1000, unidad: 'PSI', ejemplo: '120.0' },
  VIBRACION: { min: 1, max: 200, unidad: 'Hz', ejemplo: '50.0' },
  FLUJO: { min: 1, max: 1000, unidad: 'L/min', ejemplo: '200.0' },
};

/**
 * Valida un valorUmbral para un tipoLectura dado.
 * Devuelve un mensaje de error o null si es válido.
 */
export const validarUmbral = (
  valor: number,
  tipoLectura: TipoLectura
): string | null => {
  if (Number.isNaN(valor) || valor <= 0) {
    return 'El valor umbral debe ser un número mayor a 0';
  }
  const { min, max, unidad } = RANGOS_UMBRAL[tipoLectura];
  if (valor < min || valor > max) {
    return `El valor umbral para ${tipoLectura} debe estar entre ${min} y ${max} ${unidad}`;
  }
  return null;
};
