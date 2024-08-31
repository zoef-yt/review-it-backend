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
    console.log('validateUsername', validateUserNameDTO);
    return this.authService.validateUserName(validateUserNameDTO);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    const ipAddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;
    const ip = ipAddress.split(',').shift()?.trim();
    return this.authService.login(loginUserDto, ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip);
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
    const id = req.user;
    await this.authService.changePassword(id, changePasswordDto);
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
// @Post('invalidate-tokens')
// @HttpCode(HttpStatus.OK)
// async invalidateTokens(@Body('userId') userId: string) {
//   console.log('Invalidating tokens for user:', userId);
//   await this.authService.invalidateTokens(userId);
//   return { message: 'All tokens invalidated' };
// }
