import express from 'express';
import {
  getAllExperts,
  adminGetGuestRequests,
  adminGetGuestRequestById,
  adminAcknowledgeRequest,
  adminUpdateGuestRequest,
  adminApproveSubmission,
  adminConfirmPaymentAndDeliver,
  adminDeleteGuestRequest,
} from '../../controllers/admin/adminGuestRequestController.js';

import {
  authMiddleware,
  protectAdmin,
} from '../../middleware/authMiddleware.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All routes below require:
| - Authenticated user
| - Admin role
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);
router.use(protectAdmin);

// GET all experts for assignment dropdown
router.get('/experts', getAllExperts);

/*
|--------------------------------------------------------------------------
| 1️⃣ GET ALL REQUESTS
|--------------------------------------------------------------------------
*/
router.get('/', adminGetGuestRequests);

/*
|--------------------------------------------------------------------------
| 2️⃣ GET SINGLE REQUEST
|--------------------------------------------------------------------------
*/
router.get('/:id', adminGetGuestRequestById);

/*
|--------------------------------------------------------------------------
| 3️⃣ ACKNOWLEDGE REQUEST
|--------------------------------------------------------------------------
*/
router.patch('/:id/acknowledge', adminAcknowledgeRequest);

/*
|--------------------------------------------------------------------------
| 4️⃣ UPDATES REQUEST VALUES
|--------------------------------------------------------------------------
*/
router.put('/:id/update', adminUpdateGuestRequest);

/*
|--------------------------------------------------------------------------
| 5️⃣ APPROVE SUBMISSION
|--------------------------------------------------------------------------
*/
router.patch('/:id/approve', adminApproveSubmission);

/*
|--------------------------------------------------------------------------
| 6️⃣ CONFIRM PAYMENT & DELIVER
|--------------------------------------------------------------------------
*/
router.patch('/:id/complete', adminConfirmPaymentAndDeliver);

/*
|--------------------------------------------------------------------------
| 7️⃣ DELETE REQUEST
|--------------------------------------------------------------------------
*/
router.delete('/:id', adminDeleteGuestRequest);

export default router;
