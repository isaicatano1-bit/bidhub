/**
 * BIDHUB — Feature: auth
 * Servicio de autenticación — Casos de uso: registro, login, refresh y logout.
 *
 * ESTADO: Estructura y contratos definidos. Implementación pendiente (Fase 3).
 *
 * DEPENDENCIAS:
 *   - AuthRepository → acceso a datos
 *   - security (lib/security) → hash y JWT
 *   - env (lib/env) → JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN_DAYS
 *
 * NOTA: Este servicio NO importa NextRequest/NextResponse.
 *       El transporte HTTP es responsabilidad exclusiva de los Route Handlers.
 */

import type { RegisterDto, LoginDto } from "@/features/auth/schemas";
import type { AuthenticatedUser } from "@/features/auth/types";

// ── Tipos de resultado del servicio ──────────────────────────────────────────

export interface RegisterResult {
  user: AuthenticatedUser;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string; // Rotación: se emite un nuevo refresh token
}

// ── Contrato del servicio ─────────────────────────────────────────────────────

export interface AuthService {
  /**
   * Caso de uso: Registro de usuario.
   *
   * Reglas de negocio:
   * - El correo no puede estar ya registrado.
   * - La contraseña se hashea con bcrypt antes de persistir.
   * - El rol asignado siempre es USER (ADMIN solo via seed).
   *
   * @throws EmailAlreadyExistsError si el correo ya existe.
   */
  register(data: RegisterDto): Promise<RegisterResult>;

  /**
   * Caso de uso: Inicio de sesión.
   *
   * Reglas de negocio:
   * - Compara la contraseña con el hash almacenado.
   * - Genera un access token (JWT corto, default 15m) y un refresh token (opaco, largo).
   * - El refresh token se hashea y se almacena en la base de datos.
   * - Nunca se devuelven tokens en el cuerpo de la respuesta; los asigna el Route Handler en cookies.
   *
   * @throws InvalidCredentialsError si el correo o la contraseña son incorrectos.
   */
  login(data: LoginDto): Promise<LoginResult>;

  /**
   * Caso de uso: Renovación del access token.
   *
   * Reglas de negocio:
   * - Verifica que el refresh token sea válido y no esté revocado.
   * - Aplica rotación: invalida el refresh token actual y emite uno nuevo.
   * - Devuelve un nuevo access token y el nuevo refresh token.
   *
   * @throws RefreshTokenRevokedError si el token está revocado.
   * @throws InvalidTokenError si el token no existe.
   */
  refresh(rawRefreshToken: string): Promise<RefreshResult>;

  /**
   * Caso de uso: Cierre de sesión.
   *
   * Revoca todos los refresh tokens del usuario actual.
   * La eliminación de las cookies es responsabilidad del Route Handler.
   */
  logout(userId: string): Promise<void>;

  /**
   * Caso de uso: Obtener el usuario autenticado actual.
   *
   * Verifica el access token del request y retorna el perfil del usuario.
   *
   * @throws UnauthorizedError si el token es inválido o ha expirado.
   */
  getCurrentUser(accessToken: string): Promise<AuthenticatedUser>;
}

// ── Pendiente de implementación ───────────────────────────────────────────────

/**
 * TODO (Fase 3): Implementar AuthServiceImpl que inyecte AuthRepository y security.
 * Exportar una instancia singleton para uso en los Route Handlers.
 */
export declare const authService: AuthService;
