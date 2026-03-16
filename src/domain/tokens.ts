import { InjectionToken } from '@nestjs/common';

const token = (desc?: string): InjectionToken => Symbol(desc);

export const USER_REPO = token('USER_REPO');
export const TOKEN_SERVICE = token('TOKEN_SERVICE');
export const PRIVATE_KEY = token('PRIVATE_KEY');
export const APP_NAME = token('APP_NAME');
export const CACHING_SERVICE = token('CACHING_SERVICE');
