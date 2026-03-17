import { TwoFactorService } from '@app/services/2fa.service';
import { TokenService } from '@app/services/token.service';
import { ROLE, User } from '@domain/entities/user.entity';
import type { CachingService } from '@domain/services/caching.service';
import type { UserRepo } from '@domain/repos/user.repo';
import { CACHING_SERVICE, USER_REPO } from '@domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import type {
  OtpLoginIn,
  OtpLoginOut,
  RegisterIn,
  RegisterOut,
  StdLoginIn,
  StdLoginOut,
} from './auth.use-case.types.ts';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(CACHING_SERVICE) private readonly cache: CachingService,
    @Inject() private readonly token: TokenService,
    @Inject() private readonly otp: TwoFactorService,
  ) {}

  async register({
    email,
    password,
    username,
  }: RegisterIn): Promise<RegisterOut> {
    if (await this.userRepo.exists({ email, username })) {
      throw new Error('user already exists');
    }

    const password_hash = await hash(password);
    const userId = crypto.randomUUID() as string;

    const user: User = {
      id: userId,
      email,
      password: password_hash,
      username,
      createdAt: new Date(),
      role: ROLE.CLIENT,
      trustedDevices: [],
    };

    await this.userRepo.store(user);
    return { userId };
  }

  async stdLogin({
    deviceId,
    email,
    username,
    password,
  }: StdLoginIn): Promise<StdLoginOut> {
    const user = await this.userRepo.get({ email, username });
    if (!user || !(await verify(user.password, password))) {
      throw new Error('invalid user or password');
    }

    if (this.isRequired2fa({ user, deviceId })) {
      await this.cache.store(`otp:session:${user.id}`, '1', 60);
      throw new Error('require 2FA');
    }

    const [access, refresh] = await this.token.create(user);
    return { access, refresh };
  }

  async otpLogin({
    userId,
    otpCode,
    saveDeviceId,
    deviceId,
  }: OtpLoginIn): Promise<OtpLoginOut> {
    const session = await this.cache.get(`otp:session:${userId}`, true);
    if (!session) throw new Error('unexpected 2FA login');
    const remove = this.cache.remove(`otp:session:${userId}`);

    const user = await this.userRepo.get({ id: userId });
    if (!user) throw new Error('invalid user');
    if (!user.otpSecret) throw new Error('2FA is not active');
    const { otpSecret } = user;

    if (!(await this.otp.isValid({ otpSecret, otpCode }))) {
      throw new Error('Invalid 2FA code');
    }

    if (saveDeviceId) {
      await this.userRepo.update(user.id, {
        trustedDevices: [...user.trustedDevices, deviceId],
      });
    }

    await remove;
    const [access, refresh] = await this.token.create(user);
    return { access, refresh };
  }

  // internal use-cases
  isRequired2fa({
    user,
    deviceId,
  }: {
    user: User;
    deviceId?: string;
  }): boolean {
    if (!user.otpSecret) return false;
    if (!deviceId) return true;

    return !user.trustedDevices.includes(deviceId);
  }
}
