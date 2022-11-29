import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TestGuardC implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.isAdmin === false) {
      throw new HttpException('UNAUTHORIZED ACCESS', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}

/*
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '../auth/user.model';

@Injectable()
export class TestGuardC implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user);
  }

  matchRoles(grants: Role[], user: User) {
    return grants.some((isAdmin) => isAdmin === Role[user.isAdmin]);
  }
}
*/
