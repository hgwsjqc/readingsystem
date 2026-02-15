import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('post/:postId')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('postId') postId: number, @Req() req) {
    const { user } = req;
    return this.likesService.likePost(user.id, postId);
  }

  @Delete('post/:postId')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('postId') postId: number, @Req() req) {
    const { user } = req;
    return this.likesService.unlikePost(user.id, postId);
  }

  @Get('post/:postId')
  async getPostLikes(@Param('postId') postId: number) {
    return this.likesService.getPostLikes(postId);
  }
}
