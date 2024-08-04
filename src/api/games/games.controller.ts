import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { FetchGamesResponseDto, GameDto } from './dto/game.dto';

@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async fetchGames(
    @Query('page_size') page_size: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<FetchGamesResponseDto> {
    return this.gamesService.fetchGames(page_size, page, search);
  }

  @Get(':slug')
  async fetchSingleGame(@Param('slug') slug: string): Promise<GameDto> {
    return this.gamesService.fetchSingleGame(slug);
  }
}
