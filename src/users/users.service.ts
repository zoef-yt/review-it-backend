import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from 'src/auth/schema/user.schema';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { GameActionType, UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    return user;
  }

  async findOne(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email });
  }

  async updatePlayedGame(id: string, updateUserDto: Partial<UpdateUserDTO>): Promise<UserDTO | undefined> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return undefined;
    const { action, playedGames } = updateUserDto.games;

    if (action === GameActionType.ADD && playedGames) {
      playedGames.forEach((newGame) => {
        const existingGame = user.games.playedGames.find((game) => game.gameID === newGame.gameID);
        if (existingGame) {
          throw new BadRequestException(`Game "${newGame.gameName ?? ''}" already exists in played games list.`);
        } else {
          user.games.playedGames.push(newGame);
        }
      });
    } else if (action === GameActionType.REMOVE && playedGames) {
      const existingGameIDs = user.games.playedGames.map((game) => game.gameID);
      const missingGames = playedGames.filter((removeGame) => !existingGameIDs.includes(removeGame.gameID));
      if (missingGames.length > 0) {
        throw new BadRequestException('One or more games to remove do not exist in the played games list.');
      }
      user.games.playedGames = user.games.playedGames.filter(
        (game) => !playedGames.some((removeGame) => removeGame.gameID === game.gameID),
      );
    }
    return this.mapObjectToUserDTO(user);
  }

  async getUserById(id: string): Promise<UserDTO | undefined> {
    const user = await this.userModel.findById(id);
    return this.mapObjectToUserDTO(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    return this.mapObjectToUserDTO(user);
  }

  private async mapObjectToUserDTO(user: UserDocument): Promise<UserDTO | undefined> {
    if (!user) {
      return undefined;
    }
    await user.populate({
      path: 'reviews',
      model: 'GameReview',
      populate: {
        path: 'game',
        model: 'Game',
      },
    });
    await user.save();
    return {
      _id: user._id as Types.ObjectId,
      lastLogin: user.lastLogin,
      email: user.email,
      createdAt: user.createdAt,
      name: user.name,
      games: user.games
        ? {
            likeGenres: user.games.likeGenres.map((genre) => ({
              genreID: genre.genreID,
              genreName: genre.genreName,
              genreSlug: genre.genreSlug,
            })),
            playedGames: user.games.playedGames.map((game) => ({
              // _id: game._id as Types.ObjectId,
              gameID: game.gameID,
              gameName: game.gameName,
              gameImage: game.gameImage,
              gameSlug: game.gameSlug,
            })),
            currentGame: user.games.currentGame.map((game) => ({
              gameID: game.gameID,
              gameName: game.gameName,
              gameImage: game.gameImage,
              gameSlug: game.gameSlug,
            })),
          }
        : undefined,
      reviews: user.reviews.map((review: any) => ({
        _id: review._id as Types.ObjectId,
        rating: review.rating,
        comment: review.comment,
        game: {
          _id: review.game._id as Types.ObjectId,
          gameID: review.game._id.toString(),
          gameName: review.game.title,
          gameImage: review.game.gameImage || '',
          gameSlug: review.game.gameSlug || '',
        },
      })),
    };
  }
}
