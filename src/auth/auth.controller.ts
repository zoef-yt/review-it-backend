import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { ValidateUsernameDTO } from 'src/users/dto/validate-username.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/auth.guards';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Post('validate-username')
  @HttpCode(HttpStatus.OK)
  async validateUsername(@Body() validateUserNameDTO: ValidateUsernameDTO): Promise<{ valid: boolean }> {
    console.log('Validating username: I ran the validateUsername method');
    return this.authService.validateUserName(validateUserNameDTO);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req) {
    const id = req.user;
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const user = req.user;
    await this.authService.changePassword(user._id, user.email, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(requestPasswordResetDto);
    return { message: 'If the email exists, a password reset link has been sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password reset successful' };
  }
}
