import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { UserService } from 'src/modules/user/user.service';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { User } from 'src/database/entities/user.entity';

const logger = new Logger();

type JwtPayload = Pick<User, 'id' | 'username' | 'roles'> & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly httpContext: HttpRequestContextService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const exp = payload.exp;
    if (exp && exp * 1000 < Date.now()) {
      logger.warn(`The token is expired at %j`, new Date(exp));
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({ id: payload.id });
    if (!user.isActive) {
      throw new ForbiddenException();
    }

    if (!user) {
      logger.warn(`User %j is not found or not active %j`, user?.username);
      throw new UnauthorizedException();
    }

    const currUser: UserResDto = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    this.httpContext.setUser(currUser);

    return currUser;
  }
}
