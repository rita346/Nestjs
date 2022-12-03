import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: boolean[]) => SetMetadata('ROLES_KEY', roles);
