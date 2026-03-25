import express from 'express';
import {
  getClientProjects,
  getClientProjectDetails,
  requestRevision,
  getProjectPaymentStatus,
  requestManualPaymentConfirmation,
  downloadWork,
  markProjectDownloaded,
} from '../../controllers/client/clientProjectController.js';

import {
  initiateProjectPayment,
  manualPayment,
  retryFailedPayment,
} from '../../controllers/mpesa/mpesaCallbackController.js';

import {
  authMiddleware,
  protectClient,
} from '../../middleware/authMiddleware.js';

const router = express.Router();

/* ============================ CLIENT PROJECT ROUTES =========================== */

// Get all client projects
router.get('/', authMiddleware, protectClient, getClientProjects);

// Pay for project (MPESA STK push)
router.post(
  '/:projectId/pay',
  authMiddleware,
  protectClient,
  initiateProjectPayment,
);

// Client requests admin to confirm Paybill payment
router.post(
  '/:projectId/request-payment-confirmation',
  authMiddleware,
  protectClient,
  requestManualPaymentConfirmation,
);

// Retry failed payment (MPESA)
router.post(
  '/:projectId/pay/retry',
  authMiddleware,
  protectClient,
  retryFailedPayment,
);

// Manual payment fallback (Paybill/Till)
router.post(
  '/:projectId/manual-pay',
  authMiddleware,
  protectClient,
  manualPayment,
);

// Get payment status
router.get(
  '/:projectId/payment-status',
  authMiddleware,
  protectClient,
  getProjectPaymentStatus,
);

// Download completed work
router.get('/:projectId/download', authMiddleware, protectClient, downloadWork);

// Mark project as downloaded
router.post('/:projectId/downloaded', authMiddleware, markProjectDownloaded);

// Request revision
router.post(
  '/revision/:projectId',
  authMiddleware,
  protectClient,
  requestRevision,
);

// Get single project details (generic)
router.get(
  '/:projectId',
  authMiddleware,
  protectClient,
  getClientProjectDetails,
);

export default router;
