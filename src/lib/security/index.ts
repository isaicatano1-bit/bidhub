/**
 * BIDHUB - Utilidades de seguridad compartidas
 * Abstracciones criptográficas centralizadas para hash de contraseñas (bcryptjs)
 * y firma/verificación de tokens JWT (jose).
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface SessionTokenPayload extends JWTPayload {
  sub: string; // User ID
  email: string;
  role: "USER" | "ADMIN";
}

export interface SecurityService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(plain: string, hashed: string): Promise<boolean>;
  signToken(payload: SessionTokenPayload, secret: string, expiresIn: string): Promise<string>;
  verifyToken<T extends JWTPayload = SessionTokenPayload>(
    token: string,
    secret: string
  ): Promise<T>;
}

const SALT_ROUNDS = 12;

export const security: SecurityService = {
  /**
   * Genera un hash seguro para contraseñas usando bcrypt.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Compara una contraseña en texto plano contra su hash bcrypt.
   */
  async comparePasswords(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  },

  /**
   * Firma un token JWT usando 'jose'.
   */
  async signToken(
    payload: SessionTokenPayload,
    secret: string,
    expiresIn: string
  ): Promise<string> {
    const encodedSecret = new TextEncoder().encode(secret);
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(encodedSecret);
  },

  /**
   * Verifica la validez y firma de un token JWT usando 'jose'.
   */
  async verifyToken<T extends JWTPayload = SessionTokenPayload>(
    token: string,
    secret: string
  ): Promise<T> {
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as T;
  },
};
