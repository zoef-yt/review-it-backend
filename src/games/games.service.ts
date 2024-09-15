import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './schema/games.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  // async findOne(id: string): Promise<Game> {
  //   if (!isValidObjectId(id)) {
  //     throw new BadRequestException(`Invalid ID format: ${id}`);
  //   }
  //   const game = await this.gameModel.findById(id).exec();
  //   if (!game) {
  //     throw new NotFoundException(`Game with id ${id} not found`);
  //   }
  //   return game;
  // }

  // async findOneByGameID(gameID: string): Promise<Game> {
  //   const game = await this.gameModel.findOne({ gameID: gameID }).exec();
  //   if (!game) {
  //     throw new NotFoundException(`Game with gameID ${gameID} not found`);
  //   }
  //   return game;
  // }

  async findOneByGameSlug(gameSlug: string): Promise<Game> {
    const game = await this.gameModel
      .findOne({ gameSlug: gameSlug })
      .select('gameName gameSlug gameImage reviewsCount averageRating')
      .populate({
        path: 'reviews',
        model: 'GamesReviews',
        select: '_id rating comment createdAt',
        populate: {
          path: 'userID',
          model: 'User',
          select: 'username',
        },
      })
      .exec();
    return game;
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async addReviewToGame(gameID: string, reviewID: string): Promise<void> {
    await this.gameModel.findByIdAndUpdate(gameID, { $push: { reviews: reviewID } }).exec();
  }
}
