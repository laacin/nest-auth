import { User, UserCred } from '@domain/entities/user.entity';

export interface UserRepo {
  store(user: User): Promise<void>;

  exists(cred: Partial<UserCred>): Promise<boolean>;
  get(cred: Partial<UserCred>): Promise<User | undefined>;
}
