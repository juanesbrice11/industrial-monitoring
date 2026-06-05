export type SensorTipo = 'TEMPERATURA' | 'PRESION' | 'VIBRACION' | 'FLUJO';

export interface Sensor {
  id: number;
  nombre: string;
  tipo: SensorTipo;
  fabricante: string;
  fechaFabricacion: Date;
  createdAt: Date;
}

export interface CreateSensorDto {
  nombre: string;
  tipo: SensorTipo;
  fabricante: string;
  fechaFabricacion: Date;
}
