import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtUser } from '../interfaces/jwt-user.interface';
import { KeycloakJwtPayload } from '../interfaces/jwt-payload.interface';
@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,

        jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      }),

      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,

      algorithms: ['RS256'],
    });
  }

  async validate(payload: KeycloakJwtPayload): Promise<JwtUser> {
    return {
      id: payload.sub,

      username: payload.preferred_username,

      email: payload.email,

      roles: payload.realm_access?.roles ?? [],

      groups: payload.groups ?? [],
    };
  }
}
