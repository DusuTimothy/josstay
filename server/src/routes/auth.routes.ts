import { Router } from "express";
import {
  google,
  login,
  me,
  register,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "../validators/auth.validator";

export const authRoutes = Router();

authRoutes.use(authLimiter);

authRoutes.post("/register", validate({ body: registerSchema }), register);
authRoutes.post("/login", validate({ body: loginSchema }), login);
authRoutes.post("/google", validate({ body: googleAuthSchema }), google);

authRoutes.get("/me", requireAuth, me);
