import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/untils/enums";

// Roles decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
