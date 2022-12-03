import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../auth/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<boolean[]>(
      'ROLES_KEY',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user);
  }

  matchRoles(grants: boolean[], user: User) {
    return grants.some((isAdmin) => isAdmin === user.isAdmin);
  }
}
