import { type ContextHTTP, UseContext } from '@adapter/http';
import { AuthValidator } from '@adapter/validations/auth.validator';
import { AuthUseCase } from '@app/use-cases/auth.use-case';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(@Inject() private readonly use: AuthUseCase) {}

  @Post('/register')
  async postRegister(@UseContext() { req, res }: ContextHTTP) {
    const dto = AuthValidator.register(req.body);

    const response = await this.use.register(dto);
    res.status(201).send({ ok: true, response });
  }

  @Post('/login')
  async postLogin(@UseContext() { req, res }: ContextHTTP) {
    const dto = AuthValidator.login(req.body);

    const response = await this.use.login(dto);
    res.status(201).send({ ok: true, response });
  }
}
