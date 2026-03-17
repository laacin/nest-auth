import { TwoFactorService } from '@app/services/2fa.service';
import { TokenService } from '@app/services/token.service';
import { ROLE, User } from '@domain/entities/user.entity';
import type { CachingService } from '@domain/services/caching.service';
import type { UserRepo } from '@domain/repos/user.repo';
import { CACHING_SERVICE, USER_REPO } from '@domain/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import type {
  Create2FAIn,
  Create2FAOut,
  Enable2FAIn,
  Enable2FAOut,
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
      await this.cache.store(`otp:session:${user.id}`, '1', 240);
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
    await this.cache.remove(`otp:session:${userId}`);

    const user = await this.userRepo.get({ id: userId });
    if (!user) throw new Error('user not found');
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

    const [access, refresh] = await this.token.create(user);
    return { access, refresh };
  }

  async create2FA({ userId }: Create2FAIn): Promise<Create2FAOut> {
    const user = await this.userRepo.get({ id: userId });
    if (!user) throw new Error('user not found');

    const { otpSecret, otpUri } = this.otp.create({ email: user.email });

    await this.cache.store(`otp:create:${userId}`, otpSecret, 3600);
    return { otpUri };
  }

  async enable2FA({ userId, otpCode }: Enable2FAIn): Promise<Enable2FAOut> {
    const otpSecret = await this.cache.get(`otp:create:${userId}`);
    if (!otpSecret) throw new Error('unexpected 2FA activation request');
    await this.cache.remove(`otp:create:${userId}`);

    const isValid = await this.otp.isValid({ otpSecret, otpCode });
    if (!isValid) throw new Error('invalid 2FA code');

    await this.userRepo.update(userId, { otpSecret });
    return { userId };
  }

  // internal use-cases
  private isRequired2fa({
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
