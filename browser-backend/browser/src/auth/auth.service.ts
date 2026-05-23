import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import {
  PrismaService 
} from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
// nestjs 内置了jwt 模块 
// 需要安装的 性能比较好
// @nestjs 插件式  企业级同时保持小巧
// 注入的方式注入Auth模块
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    // name 查询
    const user = await this.prisma.user.findUnique({
      where: {
        name
      }
    })
    if(!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误')
    }
    const tokens = await this.generateTokens(user.id, user.name);
    return {
      ...tokens,
      user:{
        id: user.id.toString(),
        name: user.name
      }
    }
  }
  async refreshToken(rt: string) {
    try {
      const payload = await this.jwtService.verifyAsync(rt, {
        secret: process.env.TOKEN_SECRET
      });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的 Refresh Token');
      }
      return this.generateTokens(payload.sub, payload.name);
    } catch(e) {
      throw new UnauthorizedException('Refresh Token 已失效，请重新登录')
    }
  }
  // OOP private 方法 复杂度剥离
  private async generateTokens(id: number, name: string) {
    const payload = {
      sub: id,
      name
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.TOKEN_SECRET
      }),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          expiresIn: '7d',
          secret: process.env.TOKEN_SECRET
        }
      ),
    ])
    return {
      access_token: at,
      refresh_token: rt
    }
  }
}