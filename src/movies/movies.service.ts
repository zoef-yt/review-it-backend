import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMovieDto } from './dto/create-movies.dto';
import { Movie } from './schema/movies.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findAll(): Promise<{ count: number; data: Movie[] }> {
    const data = await this.movieModel.find().exec();
    return { count: 0, data };
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie = new this.movieModel(createMovieDto);
    return newMovie.save();
  }
}
