import { Router } from 'express';
import {
  getAllSensors,
  getZonesBySensor,
} from '../controllers/sensor.controller';

const router = Router();

router.get('/', getAllSensors);
router.get('/:id/zones', getZonesBySensor);

export default router;
