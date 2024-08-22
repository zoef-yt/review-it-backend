import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { FetchGamesQueryDto, FetchSingleGameQueryDto } from './dto/fetchGames.dto';

@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async fetchGames(@Query() query: FetchGamesQueryDto) {
    const { page_size = 15, page = 1, search } = query;
    return this.gamesService.fetchGames({ page_size, page, search });
  }

  @Get(':slug')
  async fetchSingleGame(@Param() params: FetchSingleGameQueryDto) {
    const { slug } = params;
    return this.gamesService.fetchSingleGame(slug.toString());
  }
}
