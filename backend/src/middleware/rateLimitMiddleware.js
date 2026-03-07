import rateLimit from 'express-rate-limit';

export const aiRewriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 rewrites per user per window
  message: {
    message: 'Too many AI rewrite requests. Please try again later.',
  },
});
