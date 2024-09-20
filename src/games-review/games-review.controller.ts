import { Body, Controller, Get, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { GamesReviewService } from './games-review.service';
import { CreateGamesReviewDto } from './dto/create-games-review.dto';

@Controller('games-review')
export class GamesReviewController {
  constructor(private readonly gamesReviewService: GamesReviewService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req, @Body() createGamesReviewDto: CreateGamesReviewDto) {
    const userIdFromToken = req.user._id;
    const userIdFromRequest = createGamesReviewDto.userID;
    if (userIdFromToken.toString() !== userIdFromRequest.toString()) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
    return this.gamesReviewService.createReview(createGamesReviewDto);
  }

  @Get(':gameSlug')
  async getReviewsForGame(@Param('gameSlug') gameSlug: string, @Query('excludeUserId') excludeUserId?: string) {
    return await this.gamesReviewService.getReviewsByGameSlug(gameSlug, excludeUserId);
  }

  @UseGuards(AuthGuard)
  @Get('game/:gameSlug')
  async getUserReviewForGame(@Request() req, @Param('gameSlug') gameSlug: string) {
    const userId = req.user._id;
    return await this.gamesReviewService.getUserReviewForGame(userId, gameSlug);
  }
}
