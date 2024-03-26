import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateCredentialDto, AuthCredentialsDto } from 'src/modules/auth/dto/credentials.dto';
import { UserResDto } from 'src/modules/user/dto/user-res.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserRole } from 'src/common/common.enum';
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
    const userId = this.httpContext.getUser().id;
    const user = await this.usersService.findOne({ id: userId });

    const dto: UserResDto = {
      id: user.id,
      roles: user.roles,
      student: user.student,
      company: user.company,
    };

    return dto;
  }

  async validateLogin(loginDto: AuthCredentialsDto): Promise<{ token: string }> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });
    const isValidPassword = await bcrypt.compare(loginDto.password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException('Incorrect password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    return {
      token,
    };
  }

  async register(userDto: CreateCredentialDto): Promise<void> {
    const { email, password, role, fullName } = userDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.usersService.create({
      email,
      password: hashedPassword,
      roles: [role],
      fullName: fullName,
    });
  }
}
