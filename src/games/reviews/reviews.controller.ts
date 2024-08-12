import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDTO } from './dto/create-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('games/review')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDTO) {
    return this.reviewsService.createReview(createReviewDto);
  }
}
