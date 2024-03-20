import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/database/entities/user.entity';
import { UserChangePassDto } from 'src/modules/user/dto/change-pass-user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpContext: HttpRequestContextService
  ) {}

  async findOne(fields: EntityCondition<User>): Promise<User> {
    return await this.userModel.findOne({
      where: fields,
    });
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async add(userDto: CreateUserDto): Promise<void> {
    const { username, roles, password } = userDto;
    const existed = await this.userModel.findOne({ username });
    if (existed) {
      throw new ConflictException('This username is already associated with an account');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.userModel.create({
      username,
      password: hashedPassword,
      roles,
    });
  }

  async update(userId: string, userDto: UpdateUserDto): Promise<void> {
    await this.userModel.updateOne({ id: userId }, { ...userDto });
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ id });
  }

  async changePassword(userChangePassDto: UserChangePassDto): Promise<void> {
    const { oldPassword, newPassword } = userChangePassDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const currentUser = this.httpContext.getUser();
    const user = await this.userModel.findOne({ username: currentUser.username });
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (isValidPassword && newPassword !== oldPassword)
      await this.userModel.updateOne({ id: currentUser.id }, { password: hashedPassword });
    else {
      throw new ConflictException();
    }
  }
}
