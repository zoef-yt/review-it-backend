import { Injectable } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateGameDto } from 'src/games/dto/create-game.dto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  GetAllMovies(): { count: number; data: Movie[] } {
    return { count: this.movies.length, data: this.movies };
  }

  AddMovie(createGameDto: CreateGameDto): Movie {
    const { name } = createGameDto;
    const movie: Movie = {
      id: (this.movies.length + 1).toString(),
      name,
    };
    this.movies.push(movie);
    return movie;
  }
}
