import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcryptjs';
import { sign as jwtSign, type SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private getJwtSecret() {
    return process.env.JWT_SECRET ?? 'dev_jwt_secret_change_me';
  }

  private getJwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN ?? '1h';
  }

  private parseExpiresToMs(input: string): number {
    const match = /^(\d+)([smhd]?)$/i.exec(String(input).trim());
    if (!match) return 60 * 60 * 1000;
    const value = Number(match[1]);
    const unit = match[2]?.toLowerCase() ?? 's';
    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      case 's':
      default:
        return value * 1000;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const u = user as unknown as {
      id: string;
      name: string;
      email: string;
      role: string | null;
      created_at: Date;
      updated_at: Date;
    };
    const expiresIn = this.getJwtExpiresIn();
    const signOptions: SignOptions = { expiresIn };
    const payload: { sub: string; email: string; role: string | null } = {
      sub: u.id,
      email: u.email,
      role: u.role,
    };
    const token = jwtSign(payload, this.getJwtSecret(), signOptions) as string;
    const maxAgeMs = this.parseExpiresToMs(expiresIn);
    return {
      token,
      expiresIn,
      maxAgeMs,
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  }

  logout() {
    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    // Untuk saat ini tidak mengirim email sungguhan; hanya response generik
    return {
      requested: true,
      exists: !!user,
    };
  }
}
