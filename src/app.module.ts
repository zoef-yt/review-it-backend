import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { AuthModule } from './auth/auth.module';
import { ApiGamesModule } from './api/games/games.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { GamesModule } from './games/games.module';
import { GamesReviewModule } from './games-review/games-review.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.ENVIRONMENT === 'prod' ? process.env.MONGO_URI : process.env.MONGO_URI_DEV),
    AuthModule,
    ApiGamesModule,
    UsersModule,
    MailModule,
    GamesModule,
    GamesReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
