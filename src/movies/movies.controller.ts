import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movies.dto';
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  @Get()
  GetAllMovies(): { count: number; data: Movie[] } {
    return this.movieService.GetAllMovies();
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Movie {
    return this.movieService.AddMovie(createMovieDto);
  }
}
