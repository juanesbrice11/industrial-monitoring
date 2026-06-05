export type EstadoMonitoreo = 'ACTIVO' | 'PAUSADO';
export type TipoLectura = 'TEMPERATURA' | 'PRESION' | 'VIBRACION' | 'FLUJO';

export interface Monitoring {
  id: number;
  sensorId: number;
  zoneId: number;
  fechaInstalacion: Date;
  tipoLectura: TipoLectura;
  valorUmbral: number;
  estado: EstadoMonitoreo;
  createdAt: Date;
}

export interface CreateMonitoringDto {
  sensorId: number;
  zoneId: number;
  fechaInstalacion: Date;
  tipoLectura: TipoLectura;
  valorUmbral: number;
  estado: EstadoMonitoreo;
}

export interface UpdateMonitoringDto {
  valorUmbral?: number;
  estado?: EstadoMonitoreo;
}
