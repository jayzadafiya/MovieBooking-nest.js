import { SetMetadata } from '@nestjs/common';
import { Role } from '../utils/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
