import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import 'dotenv/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extcractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'No token found',
        code: 'TOKEN_MISSING',
      });
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token, {
        secret: String(process.env.JWT_SECRET),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request['user'] = payload;
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
      }
      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid token',
          code: 'TOKEN_INVALID',
        });
      }
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid token',
        code: 'TOKEN_INVALID',
      });
    }
    return true;
  }
  private extcractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const [, token] = authHeader.split(' ');
    return token || null;
  }
}
