import { ForbiddenException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto, CreateCredentialDto } from 'src/modules/auth/dto/credentials.dto';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { UserService } from 'src/modules/user/user.service';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly httpContext: HttpRequestContextService,
    private jwtService: JwtService,
    private usersService: UserService
  ) {}

  async getCurrentUser(): Promise<UserResDto> {
    throw new Error('test error');
    const userId = this.httpContext.getUser().id;
    const user = await this.usersService.findOne({ id: userId });
    if (!user.isActive) {
      throw new ForbiddenException('inactivated account');
    }

    const { id, username, roles } = user;

    const dto: UserResDto = {
      id,
      username,
      roles,
    };

    return dto;
  }

  async validateLogin(loginDto: AuthCredentialsDto): Promise<{ token: string }> {
    const user = await this.usersService.findOne({
      username: loginDto.username,
    });
    const isValidPassword = await bcrypt.compare(loginDto.password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException('Incorrect password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      roles: user.roles,
    });

    return {
      token,
    };
  }

  async register(userDto: CreateCredentialDto): Promise<void> {
    const { username, password, roles } = userDto;

    await this.usersService.add({
      username,
      password,
      roles: roles,
    });

    // TODO: Do mailing stuffs
    // await this.mailService.userSignUp({
    //   to: user.email,
    //   data: {
    //     hash,
    //   },
    // });
  }
}
