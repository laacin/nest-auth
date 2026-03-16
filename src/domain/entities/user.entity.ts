export type User = UserCred & UserSecurity & UserMetadata;

export interface UserCred {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface UserSecurity {
  emailVerifiedAt?: Date;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  otpSecret?: string;
}

export interface UserMetadata {
  role: ROLE;
  trustedDevices: string[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum ROLE {
  CLIENT,
  ADMIN,
}
