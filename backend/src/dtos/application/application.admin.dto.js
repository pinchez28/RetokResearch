import { expertAdminDTO } from '../expert/expert.admin.dto.js';

export const applicationAdminDTO = (app) => ({
  _id: app._id,
  proposalText: app.proposalText,
  quote: app.quote,
  estimatedDeliveryDays: app.estimatedDeliveryDays,
  status: app.status,
  submittedAt: app.submittedAt,
  expert: expertAdminDTO(app.expertSnapshot),
});
