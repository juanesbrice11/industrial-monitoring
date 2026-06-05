export type EstadoOperativo = 'ACTIVA' | 'INACTIVA' | 'MANTENIMIENTO';

export interface Zone {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estadoOperativo: EstadoOperativo;
  createdAt: Date;
}

export interface CreateZoneDto {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estadoOperativo: EstadoOperativo;
}
