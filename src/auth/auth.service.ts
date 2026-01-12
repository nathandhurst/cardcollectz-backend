import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private buildAuthResponse(user: { id: number; username: string; email: string }) {
    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      username: user.username,
      email: user.email,
    };
  }

  async register(dto: RegisterDto) {
    const { username, email, password } = dto;

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      if (existing.username === username) {
        throw new ConflictException('Username is already taken');
      }
      if (existing.email === email) {
        throw new ConflictException('Email is already registered');
      }
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return this.buildAuthResponse(user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.validateUser(username, password);
    return this.buildAuthResponse(user);
  }
}
