import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  private readonly games: Game[] = [
    { id: '1', name: 'one' },
    { id: '2', name: 'two' },
    { id: '3', name: 'three' },
    { id: '4', name: 'four' },
    { id: '5', name: 'five' },
    { id: '6', name: 'six' },
  ];

  private getUniqueRandomIndices(max: number, count: number): number[] {
    const indices = new Set<number>();
    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * max);
      indices.add(randomIndex);
    }
    return Array.from(indices);
  }

  findAll(): { data: Game[]; count: number } {
    return { count: this.games.length, data: this.games };
  }

  getGamesOfTheYear(): { data: Game[]; count: number } {
    const numGames = Math.max(1, Math.floor(Math.random() * this.games.length));
    const indices = this.getUniqueRandomIndices(this.games.length, numGames);
    const data: Game[] = indices.map((index) => this.games[index]);
    return { count: data.length, data };
  }

  findOne(id: string): Game {
    const game = this.games.find((game) => game.id === id);
    if (game) {
      return game;
    }
    return { id, name: 'Game not found' };
  }

  create(createGameDto: CreateGameDto): Game {
    const { name } = createGameDto;

    const game: Game = {
      id: (this.games.length + 1).toString(),
      name,
    };
    this.games.push(game);
    return game;
  }
}
