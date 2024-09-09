import { Controller, Get, Param } from '@nestjs/common';

import { GamesService } from './games.service';
import { Game } from './schema/games.schema';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':gameSlug')
  async GetSingleGame(@Param('gameSlug') gameSlug: string): Promise<Game> {
    return this.gamesService.findOneByGameSlug(gameSlug);
  }
}
