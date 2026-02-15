import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('post/:postId')
  async getCommentsByPost(@Param('postId') postId: number) {
    return this.commentsService.getCommentsByPost(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const { user } = req;
    return this.commentsService.createComment({
      ...createCommentDto,
      userId: user.id,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: number, @Req() req) {
    const { user } = req;
    return this.commentsService.deleteComment(id, user.id);
  }
}
