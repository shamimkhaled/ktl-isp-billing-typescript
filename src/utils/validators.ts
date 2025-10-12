
// src/utils/validators.ts
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

export const loginIdSchema = z
  .string()
  .min(3, 'Login ID must be at least 3 characters')
  .max(50, 'Login ID must be less than 50 characters')
  .regex(/^[a-zA-Z0-9_.-]+$/, 'Login ID can only contain letters, numbers, dots, dashes, and underscores');

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const validateLoginId = (loginId: string): boolean => {
  return loginIdSchema.safeParse(loginId).success;
};
