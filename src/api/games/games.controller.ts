import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { FetchGamesResponseDto, GameDto } from './dto/game.dto';

@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async fetchGames(
    @Query('page_size') page_size?: number,
    @Query('page') page?: number,
    @Query('search') search?: string,
  ): Promise<FetchGamesResponseDto> {
    const finalPageSize = isNaN(page_size) || page_size <= 0 ? 15 : page_size;
    const finalPage = isNaN(page) || page <= 0 ? 1 : page;
    return this.gamesService.fetchGames(finalPageSize, finalPage, search);
  }

  @Get(':slug')
  async fetchSingleGame(@Param('slug') slug: string): Promise<GameDto> {
    return this.gamesService.fetchSingleGame(slug);
  }
}
