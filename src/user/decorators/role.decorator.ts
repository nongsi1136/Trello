import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/user.type';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const ROLES_KEY = 'roles';