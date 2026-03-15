import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.email(),
  username: z.string().min(4),
  password: z.string().min(7).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
});

const IdentifierSchema = z.union([z.email(), z.string().min(4)]);

const LoginSchema = z.object({
  identifier: IdentifierSchema,
  password: z.string().min(7).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
});

export class AuthValidator {
  static register(data: unknown) {
    return RegisterSchema.parse(data);
  }

  static login(data: unknown) {
    const { identifier, password } = LoginSchema.parse(data);
    const isEmail = z.email().safeParse(identifier).success;

    return isEmail
      ? { email: identifier, password }
      : { username: identifier, password };
  }
}
