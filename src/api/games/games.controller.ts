import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { FetchGamesQueryDto, FetchSingleGameQueryDto } from './dto/fetchGames.dto';

@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async fetchGames(@Query() query: FetchGamesQueryDto) {
    return this.gamesService.fetchGames(query);
  }

  @Get(':slug')
  async fetchSingleGame(@Param() params: FetchSingleGameQueryDto) {
    const { slug } = params;
    return this.gamesService.fetchSingleGame(slug.toString());
  }
}
