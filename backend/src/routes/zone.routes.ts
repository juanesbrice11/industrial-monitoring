import { Router } from 'express';
import {
  getAllZones,
  getZoneById,
  getActiveSensorsByZone,
} from '../controllers/zone.controller';

const router = Router();

router.get('/', getAllZones);
router.get('/:id/sensors', getActiveSensorsByZone);
router.get('/:id', getZoneById);

export default router;
