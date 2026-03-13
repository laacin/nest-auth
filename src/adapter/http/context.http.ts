import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

export interface ContextHTTP {
  req: Request;
  res: Response;
}

export const UseContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const http = ctx.switchToHttp();

    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    return { req, res };
  },
);
