import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest, IUserFromJwt } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IUserFromJwt => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
