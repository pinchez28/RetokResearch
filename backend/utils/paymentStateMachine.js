const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'failed', 'cancelled', 'timeout'],
  confirmed: [],
  failed: [],
  cancelled: [],
  timeout: [],
};

export const canTransition = (from, to) => {
  return ALLOWED_TRANSITIONS[from]?.includes(to);
};
