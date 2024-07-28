import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movies.dto';
import { Movie } from './schema/movies.schema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  async findAll(): Promise<{ count: number; data: Movie[] }> {
    return this.movieService.findAll();
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }
}
