import { User, UserCreds } from '@domain/entities/user.entity';

export interface UserRepo {
  store(user: User): Promise<void>;

  exists(cred: Partial<UserCreds>): Promise<boolean>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByIdentifier(identifier: string): Promise<User | undefined>;
}
