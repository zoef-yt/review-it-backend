import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './schema/games.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}
  async findAll(): Promise<{ data: Game[]; count: number }> {
    const games = await this.gameModel.find().exec();
    return { count: games.length, data: games };
  }

  async getGamesOfTheYear(): Promise<{ data: Game[]; count: number }> {
    const games = await this.gameModel.find().exec();
    return { count: games.length, data: games };
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }
}
