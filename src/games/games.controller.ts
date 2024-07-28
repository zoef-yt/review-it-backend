import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(): { data: Game[]; count: number } {
    return this.gamesService.findAll();
  }

  @Get('GameOfTheYear')
  GameOfTheYear(): { data: Game[]; count: number } {
    return this.gamesService.getGamesOfTheYear();
  }

  @Get(':gameId')
  GetSingleGame(@Param('gameId') gameId: string): Game {
    return this.gamesService.findOne(gameId);
  }

  @Post()
  create(@Body() createGameDto: CreateGameDto): Game {
    return this.gamesService.create(createGameDto);
  }
}
