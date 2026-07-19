export interface JwtUser {
  id: string;
  username?: string;
  email?: string;

  roles: string[];

  groups?: string[];
}
