import { Controller, Post, Body, Get, NotFoundException, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/auth.guards';
import type { AuthResult } from './interface';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  handleBasePath() {
    throw new NotFoundException('This route is not available');
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResult> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResult> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req) {
    const id = req.user;
    return this.usersService.getUserById(id);
  }
}
