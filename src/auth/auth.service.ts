import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

interface AuthResult {
  accessToken: string;
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResult> {
    const user = await this.userService.create({ email: createUserDto.email, password: createUserDto.password });
    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken: accessToken, email: user.email, id: user._id.toString() };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResult> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken: accessToken, email: user.email, id: user._id };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        email: user.email,
        _id: user._id.toString(),
      };
    }
    return null;
  }
}
