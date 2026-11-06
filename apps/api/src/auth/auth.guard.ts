import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { auth } from './auth.config.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      // Extract session using Better Auth from request headers/cookies
      const session = await auth.api.getSession({
        headers: request.headers as any,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException(
          'Authentication required to access cloud features.',
        );
      }

      request.user = session.user as AuthenticatedUser;
      request.session = session.session as any;
      return true;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        'Invalid or expired session. Please sign in again.',
      );
    }
  }
}
