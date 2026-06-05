import { Router } from 'express';
import {
  getAllZones,
  getZoneById,
  getSensorsByZone,
} from '../controllers/zone.controller';

const router = Router();

router.get('/', getAllZones);
router.get('/:id/sensors', getSensorsByZone);
router.get('/:id', getZoneById);

export default router;
