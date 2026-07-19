import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'keycloak',
    }),
  ],

  providers: [KeycloakStrategy, JwtAuthGuard, RolesGuard],

  exports: [PassportModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
