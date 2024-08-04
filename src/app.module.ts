import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { ApiGamesModule } from './api/games/games.module';

dotenv.config();

@Module({
  imports: [ApiGamesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
