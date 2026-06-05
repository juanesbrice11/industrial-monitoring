import api from './api';
import {
  ApiResponse,
  Sensor,
  Zone,
  Monitoring,
  ActiveSensor,
  CreateMonitoringDto,
  UpdateMonitoringDto,
  EstadoMonitoreo,
} from '../types';

/** GET /sensors */
export const getSensors = async (): Promise<ApiResponse<Sensor[]>> => {
  const { data } = await api.get<ApiResponse<Sensor[]>>('/sensors');
  return data;
};

/** GET /zones */
export const getZones = async (): Promise<ApiResponse<Zone[]>> => {
  const { data } = await api.get<ApiResponse<Zone[]>>('/zones');
  return data;
};

/** GET /sensors/:id/zones */
export const getSensorZones = async (
  id: number
): Promise<ApiResponse<Zone[]>> => {
  const { data } = await api.get<ApiResponse<Zone[]>>(`/sensors/${id}/zones`);
  return data;
};

/** GET /zones/:id */
export const getZoneById = async (
  id: number
): Promise<ApiResponse<Zone>> => {
  const { data } = await api.get<ApiResponse<Zone>>(`/zones/${id}`);
  return data;
};

/** GET /zones/:id/sensors */
export const getZonesSensors = async (
  id: number
): Promise<ApiResponse<ActiveSensor[]>> => {
  const { data } = await api.get<ApiResponse<ActiveSensor[]>>(
    `/zones/${id}/sensors`
  );
  return data;
};

/** GET /monitorings (con status opcional) */
export const getMonitorings = async (
  status?: EstadoMonitoreo
): Promise<ApiResponse<Monitoring[]>> => {
  const { data } = await api.get<ApiResponse<Monitoring[]>>('/monitorings', {
    params: status ? { status } : undefined,
  });
  return data;
};

/** POST /monitorings */
export const createMonitoring = async (
  payload: CreateMonitoringDto
): Promise<ApiResponse<Monitoring>> => {
  const { data } = await api.post<ApiResponse<Monitoring>>(
    '/monitorings',
    payload
  );
  return data;
};

/** PATCH /monitorings/:id */
export const updateMonitoring = async (
  id: number,
  payload: UpdateMonitoringDto
): Promise<ApiResponse<Monitoring>> => {
  const { data } = await api.patch<ApiResponse<Monitoring>>(
    `/monitorings/${id}`,
    payload
  );
  return data;
};
