import { DynamicModule } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { createPublicKey } from 'crypto';
import { readFileSync } from 'fs';

export interface AppConfig {
  dependencies: DynamicModule[];
  key: SignKey;
  appName: string;
}

type SignKey =
  | {
      algorithm: 'RSA';
      privateKeyPath: string;
    }
  | {
      algorithm: 'HMAC';
      secretKey: string;
    };

export const resolveKey = (key: SignKey): JwtModuleOptions => {
  switch (key.algorithm) {
    case 'HMAC':
      return {
        secret: key.secretKey,
        signOptions: { algorithm: 'HS256' },
      };

    case 'RSA': {
      const privateKey = readFileSync(key.privateKeyPath, 'utf8');
      const publicKey = createPublicKey(privateKey).export({
        type: 'spki',
        format: 'pem',
      });

      return {
        privateKey,
        publicKey,
        signOptions: { algorithm: 'RS256' },
      };
    }

    default:
      throw new Error(`unsuported algorithm`);
  }
};
