import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { ApiGamesModule } from './api/games/games.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './games/reviews/reviews.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.ENVIRONMENT === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_DEV,
    ),
    ApiGamesModule,
    AuthModule,
    UsersModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
