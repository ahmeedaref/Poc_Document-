export interface KeycloakJwtPayload {
  sub: string;

  preferred_username?: string;

  email?: string;

  realm_access?: {
    roles?: string[];
  };

  groups?: string[];
}
