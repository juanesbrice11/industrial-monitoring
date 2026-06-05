import { Application } from 'express';
import sensorRouter from './sensor.routes';
import zoneRouter from './zone.routes';
import monitoringRouter from './monitoring.routes';

/**
 * Monta todos los routers de la API sobre la instancia de Express.
 */
export const setupRoutes = (app: Application): void => {
  app.use('/sensors', sensorRouter);
  app.use('/zones', zoneRouter);
  app.use('/monitorings', monitoringRouter);
};
