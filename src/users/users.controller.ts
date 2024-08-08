import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/update-user')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/update-played-game')
  async addPlayedGame(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return await this.usersService.updatePlayedGame(id, updateUserDto);
  }

  // @Post(':id/update-current-game')
  // async removeCurrentGame(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
  //   return await this.usersService.updateCurrentGame(id, updateUserDto);
  // }

  // @Post(':id/update-like-genre')
  // async addLikeGenre(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
  //   return await this.usersService.updateLikeGenre(id, updateUserDto);
  // }
}
