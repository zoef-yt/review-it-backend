import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { GameReview, ReviewSchema } from './schema/review.schema';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GameReview.name, schema: ReviewSchema }]),
    UsersModule,
    GamesModule,
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
