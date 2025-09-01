import { Router } from 'express';
import { GatewayController } from '../controllers/gateway.controller';
import { authenticateApiKey } from '../middleware/apiKey.middleware';

const gatewayRouter = Router();
const gatewayController = new GatewayController();

gatewayRouter.post('/vitals', authenticateApiKey, gatewayController.submitVitalSigns);

export default gatewayRouter;
