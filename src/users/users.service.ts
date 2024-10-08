import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ValidateUsernameDTO } from './dto/validate-username.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUserName(validateUserNameDTO: ValidateUsernameDTO): Promise<boolean> {
    const { username } = validateUserNameDTO;
    const user = await this.userModel.findOne({ username: username.trim() });
    if (user) {
      throw new ConflictException('Username already exists');
    }
    return true;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
        username,
      });
      const user = await newUser.save();
      return user;
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern?.email) {
          throw new ConflictException('A user with this email already exists');
        }
        if (err.keyPattern?.username) {
          throw new ConflictException('A user with this username already exists');
        }
      }
      throw new InternalServerErrorException('An error occurred while creating the user');
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<UserDocument> {
    const user = usernameOrEmail.includes('@')
      ? await this.userModel.findOne({ email: usernameOrEmail }).select('_id username email password').exec()
      : await this.userModel.findOne({ username: usernameOrEmail }).select('_id username email password').exec();
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email })
      .select('_id username email resetToken resetTokenExpiry')
      .exec();
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User with this username does not exist');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel
        .findById(id)
        .select('username email lastLogin createdAt')
        .populate({
          path: 'gamesReviews',
          model: 'GamesReviews',
          select: '_id rating comment',
          populate: {
            path: 'gameID',
            model: 'Game',
            select: 'gameName gameImage gameSlug averageRating',
          },
        })
        .populate({
          path: 'playedGames',
          model: 'Game',
        })
        .populate({
          path: 'currentGame',
          model: 'Game',
        })
        .populate({
          path: 'likedGamesGenres',
          model: 'GamesGenres',
        })
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async addReviewToUser(userID: string, reviewID: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userID, { $push: { gamesReviews: reviewID } }).exec();
  }
}
