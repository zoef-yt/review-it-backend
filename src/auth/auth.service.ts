import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { MailService } from 'src/mail/mail.service';
import { ValidateUsernameDTO } from 'src/users/dto/validate-username.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUserName(validateUserNameDTO: ValidateUsernameDTO): Promise<{ valid: boolean }> {
    await this.userService.validateUserName(validateUserNameDTO);
    return { valid: true };
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      const { email, _id, username } = user;
      const payload = { email, sub: _id.toString() };
      const accessToken = await this.jwtService.signAsync(payload);
      this.mailService.sendWelcomeEmail({ email, name: username });
      return { accessToken: accessToken, email, id: _id.toString(), username };
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, userInfo, usernameOrEmail } = loginUserDto;
    const { device, ipAddress, loginTime } = userInfo;
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user || !user._id) {
      throw new NotFoundException('User with this username or email does not exist');
    }
    await this.userService.updateUser(user._id as string, { lastLogin: new Date() });
    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);
    const resetLink = `https://review-it.zoef.dev/change-password`;
    this.mailService.sendLoginAlertEmail({
      email: user.email,
      name: user.username,
      loginTime,
      ipAddress,
      resetLink,
      device,
    });
    return { accessToken: accessToken, email: user.email, id: user._id.toString(), username: user.username };
  }

  async changePassword(userId: string, email: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { userInfo } = changePasswordDto;
      const { device, ipAddress, time } = userInfo;
      const user = await this.userService.findByUsernameOrEmail(email);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
      await this.updatePassword(userId, changePasswordDto.newPassword);
      await this.invalidateTokens(userId);
      const resetLink = `https://review-it.zoef.dev/change-password`;
      this.mailService.sendChangePasswordAlertEmail({
        email: user.email,
        name: user.username,
        time,
        ipAddress,
        device,
        url: resetLink,
      });
    } catch (err) {
      console.error('Change password error:', err);
      throw err;
    }
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email, userInfo } = requestPasswordResetDto;
    const { device, ipAddress, time } = userInfo;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const resetToken = uuidv4();
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 15);
    await this.userService.updateUser(user._id as string, { resetToken: hashedToken, resetTokenExpiry });
    const resetLink = `https://review-it.zoef.dev/reset-password?email=${email}&temp_token=${resetToken}`;
    this.mailService.sendPasswordResetEmail({
      email: user.email,
      url: resetLink,
      name: user.username,
      device,
      ipAddress,
      time,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, newPassword, email, userInfo } = resetPasswordDto;
      const { device, ipAddress, time } = userInfo;
      const user = await this.userService.findByEmail(email);
      if (!token || !user.resetToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      const isTokenValid = await bcrypt.compare(token, user.resetToken);
      if (!isTokenValid || new Date() > user.resetTokenExpiry)
        throw new UnauthorizedException('Invalid or expired token');
      await this.updatePassword(user._id as string, newPassword);
      await this.userService.updateUser(user._id as string, { resetToken: null, resetTokenExpiry: null });
      await this.invalidateTokens(user._id as string);

      const resetLink = `https://review-it.zoef.dev/change-password`;
      this.mailService.sendChangePasswordAlertEmail({
        email: user.email,
        name: user.username,
        time,
        ipAddress,
        device,
        url: resetLink,
      });
      return { message: 'Password reset successfully' };
    } catch (err) {
      throw err;
    }
  }

  private async updatePassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.updateUser(userId, { password: hashedPassword });
  }

  private async invalidateTokens(userId: string): Promise<void> {
    const tokensInvalidatedAt = new Date();
    await this.userService.updateUser(userId, { tokensInvalidatedAt });
  }
}
