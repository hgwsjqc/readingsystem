import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query
} from '@nestjs/common'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto)
  }

  @Get('/stats')
  @UseGuards(JwtAuthGuard)
  async getUserStats(@Req() req) {
    const { user } = req;
    return this.usersService.getUserStats(user.id);
  }

  @Get('/articles')
  @UseGuards(JwtAuthGuard)
  async getUserArticles(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { user } = req;
    return this.usersService.getUserArticles(user.id, page, limit);
  }

  @Post('/profile')
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Req() req,
    @Body() updateData: { name?: string; bio?: string }
  ) {
    const { user } = req;
    return this.usersService.updateUserProfile(user.id, updateData);
  }

  @Get('/comments')
  @UseGuards(JwtAuthGuard)
  async getUserComments(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { user } = req;
    return this.usersService.getUserComments(user.id, page, limit);
  }

  @Get('/likes')
  @UseGuards(JwtAuthGuard)
  async getUserLikes(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { user } = req;
    return this.usersService.getUserLikes(user.id, page, limit);
  }
}
