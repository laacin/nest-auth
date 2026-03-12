import { User } from '@domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// types
interface AccessPayload {
  type: 'access';
  id: string;
}

interface RefreshPayload {
  type: 'refresh';
  id: string;
}

@Injectable()
export class TokenService {
  constructor(@Inject() private readonly jwt: JwtService) {}

  async create({ id }: User): Promise<[string, string]> {
    return await Promise.all([
      this.jwt.signAsync<AccessPayload>({ type: 'access', id }),
      this.jwt.signAsync<RefreshPayload>({ type: 'refresh', id }),
    ]);
  }

  async verify(token: string, which: 'access'): Promise<AccessPayload>;
  async verify(token: string, which: 'refresh'): Promise<RefreshPayload>;
  async verify(token: string, which: 'access' | 'refresh') {
    const payload = await this.jwt.verifyAsync<AccessPayload | RefreshPayload>(
      token,
    );

    if (which !== payload.type) throw new Error('invalid payload type');
    switch (which) {
      case 'access':
        return payload as AccessPayload;

      case 'refresh':
        return payload as RefreshPayload;

      default:
        throw new Error('unknown payload type');
    }
  }
}
