import { Controller, Get, Param } from '@nestjs/common';

import { GamesService } from './games.service';
// import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './schema/games.schema';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':gameId')
  async GetSingleGame(@Param('gameId') gameId: string): Promise<Game> {
    return this.gamesService.findOne(gameId);
  }
}
