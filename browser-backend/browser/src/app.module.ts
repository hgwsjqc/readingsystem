import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { ReadingModule } from './reading/reading.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  // PrismaModule prisma 命令行的方式， client 代表数据库
  imports: [
    PostsModule, PrismaModule, 
    UserModule, AuthModule, AIModule, ReadingModule, CommentsModule, LikesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}