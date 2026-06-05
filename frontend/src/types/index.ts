export type SensorTipo = 'TEMPERATURA' | 'PRESION' | 'VIBRACION' | 'FLUJO';
export type EstadoOperativo = 'ACTIVA' | 'INACTIVA' | 'MANTENIMIENTO';
export type EstadoMonitoreo = 'ACTIVO' | 'PAUSADO';
export type TipoLectura = 'TEMPERATURA' | 'PRESION' | 'VIBRACION' | 'FLUJO';

export interface Sensor {
  id: number;
  nombre: string;
  tipo: SensorTipo;
  fabricante: string;
  fechaFabricacion: string;
  createdAt: string;
}

export interface Zone {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estadoOperativo: EstadoOperativo;
  createdAt: string;
}

export interface Monitoring {
  id: number;
  sensorId: number;
  zoneId: number;
  fechaInstalacion: string;
  tipoLectura: TipoLectura;
  valorUmbral: number;
  estado: EstadoMonitoreo;
  createdAt: string;
}

export interface CreateMonitoringDto {
  sensorId: number;
  zoneId: number;
  fechaInstalacion: string;
  tipoLectura: TipoLectura;
  valorUmbral: number;
  estado: EstadoMonitoreo;
}

export interface UpdateMonitoringDto {
  valorUmbral?: number;
  estado?: EstadoMonitoreo;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
