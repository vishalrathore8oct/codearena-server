import type { UserRole } from "../constant.js";

export interface AuthUser {
  id: string;
  role: UserRole;
}
