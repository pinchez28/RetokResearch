import ClientProject from '../src/models/client/ClientProject.js';

export function generatePaymentRef(id) {
  return id.toString().slice(-6).toUpperCase();
}

export const generateProjectPaymentReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';

  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ref;
};

export const generateUniquePaymentReference = async () => {
  let reference;
  let exists = true;

  while (exists) {
    reference = generateProjectPaymentReference();

    const project = await ClientProject.findOne({
      paymentReference: reference,
    });

    if (!project) exists = false;
  }

  return reference;
};
