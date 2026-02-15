import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatars: {
              take: 1,
              orderBy: {
                id: 'desc',
              },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatars: {
                  take: 1,
                  orderBy: {
                    id: 'desc',
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async createComment(createCommentDto: CreateCommentDto & { userId: number }) {
    const { content, postId, userId, parentId } = createCommentDto;

    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parentComment.postId !== postId) {
        throw new ForbiddenException('Parent comment does not belong to this post');
      }
    }

    return this.prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatars: {
              take: 1,
              orderBy: {
                id: 'desc',
              },
            },
          },
        },
      },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
