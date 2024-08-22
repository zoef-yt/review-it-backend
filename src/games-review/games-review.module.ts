import { Module } from '@nestjs/common';
import { GamesReviewService } from './games-review.service';
import { GamesReviewController } from './games-review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesReviews, GamesReviewSchema } from './schema/games-review.schema';
import { GamesModule } from 'src/games/games.module';
import { UsersModule } from 'src/users/users.module';
import { GamesService } from 'src/games/games.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GamesReviews.name, schema: GamesReviewSchema }]),
    GamesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [GamesReviewController],
  providers: [GamesReviewService, GamesService],
})
export class GamesReviewModule {}
