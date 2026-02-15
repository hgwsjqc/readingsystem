import { Controller, Get, Post, Delete, Query, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { BookQueryDto } from './dto/book-query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('reading')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}

  // 获取书籍列表
  @Get()
  async getBooks(@Query() query: BookQueryDto) {
    console.log(query);
    return this.readingService.getBooks(query);
  }

  // 获取用户书架
  @Get('my-books')
  @UseGuards(JwtAuthGuard)
  async getUserBooks(@Request() req) {
    const userId = req.user.id;
    return this.readingService.getUserBooks(userId);
  }

  // 获取书籍详情
  @Get(':id')
  async getBookById(@Param('id') id: number) {
    return this.readingService.getBookById(id);
  }

  // 添加书籍到用户书架
  @Post(':id/add')
  @UseGuards(JwtAuthGuard)
  async addBookToUser(@Request() req, @Param('id') bookId: number) {
    const userId = req.user.id;
    return this.readingService.addBookToUser(userId, bookId);
  }

  // 检查书籍是否在用户书架中
  @Get(':id/check')
  @UseGuards(JwtAuthGuard)
  async checkBookInBookshelf(@Request() req, @Param('id') bookId: number) {
    const userId = req.user.id;
    const isInBookshelf = await this.readingService.isBookInUserBookshelf(userId, bookId);
    return { isInBookshelf };
  }

  // 从用户书架中移除书籍
  @Delete(':id/remove')
  @UseGuards(JwtAuthGuard)
  async removeBookFromUser(@Request() req, @Param('id') bookId: number) {
    const userId = req.user.id;
    return this.readingService.removeBookFromUser(userId, bookId);
  }
}
