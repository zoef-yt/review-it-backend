import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is missing or malformed');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findById(tokenPayload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.tokensInvalidatedAt && user.tokensInvalidatedAt > new Date(tokenPayload.iat * 1000)) {
        throw new UnauthorizedException('Token is invalid');
      }
      request.user = {
        email: tokenPayload.email,
        _id: tokenPayload.sub,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
