import { Router } from 'express';
import {
  getAllMonitorings,
  createMonitoring,
  updateMonitoring,
} from '../controllers/monitoring.controller';

const router = Router();

router.get('/', getAllMonitorings);
router.post('/', createMonitoring);
router.patch('/:id', updateMonitoring);

export default router;
