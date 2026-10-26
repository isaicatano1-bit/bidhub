/**
 * BIDHUB — Feature: auth
 * Schemas Zod para validar los datos de entrada de los endpoints de autenticación.
 */

import { z } from "zod";

// ── Registro ─────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres")
    .trim(),
  email: z.string().email("Dirección de correo inválida").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede superar 128 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un dígito"
    ),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

// ── Login ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email("Dirección de correo inválida").toLowerCase().trim(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// ── Refresh ───────────────────────────────────────────────────────────────────
// El refresh token se lee desde la cookie HttpOnly; no hay body.
// Este schema es un placeholder para validar headers o contexto si fuese necesario.

export const RefreshSchema = z.object({}).strict();
export type RefreshDto = z.infer<typeof RefreshSchema>;
