import { Inject, Injectable } from '@nestjs/common';
import { generateSecret, generateURI, verify } from 'otplib';
import { APP_NAME } from '@domain/tokens';

// types
interface CreateParams {
  email: string;
}

interface VerifyParams {
  otpSecret: string;
  otpCode: string;
}

@Injectable()
export class TwoFactorService {
  constructor(@Inject(APP_NAME) private readonly app: string) {}

  create({ email }: CreateParams) {
    const secret = generateSecret();

    const otpUri = generateURI({
      issuer: this.app,
      label: email,
      secret,
    });

    return { otpUri, secret };
  }

  async isValid({ otpSecret, otpCode }: VerifyParams) {
    return (await verify({ secret: otpSecret, token: otpCode })).valid;
  }
}
