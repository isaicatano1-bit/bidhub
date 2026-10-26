/**
 * BIDHUB - Validación y lectura segura de variables de entorno
 * Valida variables de entorno críticas mediante esquemas estrictos de Zod.
 */

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida para la conexión con PostgreSQL"),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres criptográficos"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  CRON_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;

/**
 * Valida las variables de entorno actuales.
 * Lanza un error detallado si faltan variables requeridas o su formato es inválido.
 */
export function validateEnv(): Env {
  if (parsedEnv) {
    return parsedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");

    const message = `❌ Configuración de entorno inválida:\n${issues}\nVerifica tu archivo .env contra .env.example.`;
    
    // En entornos que no sean test, notificamos el error
    if (process.env.NODE_ENV !== "test") {
      console.error(message);
    }

    throw new Error(message);
  }

  parsedEnv = result.data;
  return parsedEnv;
}

/**
 * Acceso directo y perezoso a las variables de entorno validadas.
 */
export const env = {
  get DATABASE_URL(): string {
    return validateEnv().DATABASE_URL;
  },
  get DIRECT_URL(): string | undefined {
    return validateEnv().DIRECT_URL;
  },
  get JWT_SECRET(): string {
    return validateEnv().JWT_SECRET;
  },
  get JWT_EXPIRES_IN(): string {
    return validateEnv().JWT_EXPIRES_IN;
  },
  get REFRESH_TOKEN_EXPIRES_IN_DAYS(): number {
    return validateEnv().REFRESH_TOKEN_EXPIRES_IN_DAYS;
  },
  get CRON_SECRET(): string | undefined {
    return validateEnv().CRON_SECRET;
  },
  get NEXT_PUBLIC_APP_URL(): string {
    return validateEnv().NEXT_PUBLIC_APP_URL;
  },
  get NODE_ENV(): "development" | "production" | "test" {
    return validateEnv().NODE_ENV;
  },
  get isProduction(): boolean {
    return (process.env.NODE_ENV || "development") === "production";
  },
};
