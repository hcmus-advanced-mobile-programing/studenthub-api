import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, UUIDParam } from 'src/decorators/http.decorators';
import { UserChangePassDto } from 'src/modules/user/dto/change-pass-user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  // @Auth([])
  create(@Body() userDto: CreateUserDto): Promise<void> {
    return this.userService.add(userDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @Auth([])
  update(@UUIDParam('id') id: string, @Body() userDto: UpdateUserDto): Promise<void> {
    return this.userService.update(id, userDto);
  }

  @Delete(':id')
  @Auth([])
  delete(@UUIDParam('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Put()
  @Auth()
  changePassword(@Body() userChangePassDto: UserChangePassDto): Promise<void> {
    return this.userService.changePassword(userChangePassDto);
  }
}
