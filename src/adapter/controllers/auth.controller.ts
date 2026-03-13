import { type ContextHTTP, UseContext } from '@adapter/http';
import { AuthUseCase } from '@app/use-cases/auth.use-case';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(@Inject() private readonly use: AuthUseCase) {}

  @Post('/register')
  async postRegister(@UseContext() { req, res }: ContextHTTP) {
    const { email, username, password } = req.body as Record<string, string>;

    const response = await this.use.register({ email, username, password });
    res.status(201).send({ ok: true, response });
  }

  @Post('/login')
  async postLogin(@UseContext() { req, res }: ContextHTTP) {
    const { id, email, username, password } = req.body as Record<
      string,
      string
    >;

    const response = await this.use.login({ id, email, username, password });
    res.status(201).send({ ok: true, response });
  }
}
