import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GamesReviews, GamesReviewsDocument } from './schema/games-review.schema';
import { Model } from 'mongoose';

import { CreateGamesReviewDto } from './dto/create-games-review.dto';
import { GamesService } from 'src/games/games.service';
import { Game } from 'src/games/schema/games.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GamesReviewService {
  constructor(
    @InjectModel(GamesReviews.name) private gameReviewModel: Model<GamesReviewsDocument>,
    private readonly gameService: GamesService,
    private readonly userService: UsersService,
  ) {}

  async createReview(createGamesReviewDto: CreateGamesReviewDto) {
    const user = await this.userService.findById(createGamesReviewDto.userID);
    let game: Game = null;
    if (createGamesReviewDto.gameSlug) {
      game = await this.gameService.findOneByGameSlug(createGamesReviewDto.gameSlug);
    }
    if (game) await this.checkIfReviewExists(user._id as string, game);
    if (game === null && createGamesReviewDto.game) {
      game = await this.gameService.createGame(createGamesReviewDto.game);
    }
    if (!game) {
      throw new InternalServerErrorException('Issue creating review');
    }
    const review = await this.gameReviewModel.create({
      comment: createGamesReviewDto.comment,
      rating: createGamesReviewDto.rating,
      gameID: game._id,
      userID: user._id,
      gameSlug: game.gameSlug,
    });
    await this.gameService.addReviewToGame(game._id as string, review._id as string);
    await this.userService.addReviewToUser(user._id as string, review._id as string);
    return review;
  }

  private async checkIfReviewExists(userId: string, game: Game) {
    const existingReview = await this.gameReviewModel.findOne({
      userID: userId,
      gameID: game._id,
    });
    if (existingReview) {
      throw new ConflictException('Review already exists');
    }
  }
}
