import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './schema/games.schema';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':gameId')
  async GetSingleGame(@Param('gameId') gameId: string): Promise<Game> {
    return this.gamesService.findOne(gameId);
  }

  @Post('/create')
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.createGame(createGameDto);
  }
}
