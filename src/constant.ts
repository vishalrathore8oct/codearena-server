const appName = "CodeArena";

const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export { appName, USER_ROLES };
export type { UserRole };
