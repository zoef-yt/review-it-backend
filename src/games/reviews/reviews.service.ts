import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReviewDocument, GameReview } from './schema/review.schema';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UserDocument } from 'src/auth/schema/user.schema';
import { GameDocument } from 'src/games/schema/games.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(GameReview.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Game') private gameModel: Model<GameDocument>,
  ) {}

  async createReview(createReviewDto: CreateReviewDTO) {
    const { userID, game } = createReviewDto;
    const { gameID, description, gameImage, gameName, gameSlug } = game;

    let existingGame = await this.gameModel.findOne({ gameID });
    if (!existingGame) {
      existingGame = await new this.gameModel({
        gameID,
        description,
        gameImage,
        gameName,
        gameSlug,
        reviews: [],
      }).save();
    }
    const createdReview = new this.reviewModel({
      ...createReviewDto,
      game: existingGame._id,
    });
    const review = await createdReview.save();
    await this.gameModel.findByIdAndUpdate(existingGame._id, {
      $push: { reviews: review._id },
    });
    await this.userModel.findByIdAndUpdate(userID, {
      $push: { reviews: review._id },
    });
    return review;
  }
}
