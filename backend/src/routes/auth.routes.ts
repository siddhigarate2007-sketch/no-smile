import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again in 15 minutes',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', authLimiter, validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/logout', (req, res, next) =>
  authController.logout(req, res, next)
);

router.get('/me', requireAuth, (req, res, next) =>
  authController.me(req, res, next)
);

export default router;
