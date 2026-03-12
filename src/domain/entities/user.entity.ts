export type User = UserCreds & UserSecurity & UserMetadata;

export interface UserCreds {
  id: string;
  email: string;
  password: string;
  username: string;
}

export interface UserSecurity {
  emailVerifiedAt?: Date;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
}

export interface UserMetadata {
  role: ROLE;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum ROLE {
  CLIENT,
  ADMIN,
}
