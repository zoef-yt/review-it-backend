import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from 'src/auth/schema/user.schema';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userModel.create({ email: createUserDto.email, password: hashedPassword });
    const user = await newUser.save();
    return user;
  }

  async findOne(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email });
  }

  async getById(id: string): Promise<UserDocument | undefined> {
    return await this.userModel.findById(id);
  }
}
