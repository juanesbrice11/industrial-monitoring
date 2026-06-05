import { Router } from 'express';
import {
  getAllZones,
  getActiveSensorsByZone,
} from '../controllers/zone.controller';

const router = Router();

router.get('/', getAllZones);
router.get('/:id/sensors', getActiveSensorsByZone);

export default router;
