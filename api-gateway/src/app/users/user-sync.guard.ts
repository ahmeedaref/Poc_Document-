import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserSyncGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    await this.usersService.sync(request.user);

    return true;
  }
}
