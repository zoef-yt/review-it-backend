import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewDocument, Review } from './schema/review.schema';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UserDocument } from 'src/auth/schema/user.schema';
import { GameDocument } from 'src/games/schema/games.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Game') private gameModel: Model<GameDocument>,
  ) {}

  async createReview(createReviewDto: CreateReviewDTO): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    const review = await createdReview.save();

    // Update the user document to include this review
    await this.userModel.findByIdAndUpdate(createReviewDto.user, {
      $push: { reviews: review._id },
    });

    // Update the game document to include this review
    await this.gameModel.findByIdAndUpdate(createReviewDto.game, {
      $push: { reviews: review._id },
    });

    return review;
  }
}
