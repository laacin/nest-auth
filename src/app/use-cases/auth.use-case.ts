import { TokenService } from '@app/services/token.service';
import { ROLE, User } from '@domain/entities/user.entity';
import type { UserRepo } from '@domain/repos/user.repo';
import { USER_REPO } from '@domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

// Params
interface RegisterParams {
  email: string;
  password: string;
  username: string;
}

interface LoginParams {
  id?: string;
  email?: string;
  username?: string;
  password: string;
}

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject() private readonly token: TokenService,
  ) {}

  async register({ email, password, username }: RegisterParams) {
    if (!(await this.userRepo.exists({ email, username }))) {
      throw new Error('user already exists');
    }

    const password_hash = await hash(password);
    const id = crypto.randomUUID() as string;

    const user: User = {
      id,
      email,
      password: password_hash,
      username,
      createdAt: new Date(),
      role: ROLE.CLIENT,
    };

    await this.userRepo.store(user);
    return { id, email, username };
  }

  async login({ id, email, username, password }: LoginParams) {
    const user = await this.userRepo.get({ id, email, username });
    if (!user || !(await verify(user.password, password))) {
      throw new Error('invalid user or password');
    }

    const [access, refresh] = await this.token.create(user);
    return { access, refresh };
  }
}
