import rateLimit from 'express-rate-limit';

// ================= AI Rewrite Rate Limiter =================
export const aiRewriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 rewrites per user per window
  message: {
    message: 'Too many AI rewrite requests. Please try again later.',
  },
});

// ================= LOGIN RATE LIMITER =================
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
});
