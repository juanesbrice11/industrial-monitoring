import { Router } from 'express';
import { getActiveSensorsByZone } from '../controllers/zone.controller';

const router = Router();

router.get('/:id/sensors', getActiveSensorsByZone);

export default router;
