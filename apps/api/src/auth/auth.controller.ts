import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(AnyFilesInterceptor())
  async login(
    @Body() body: { email?: string; password?: string },
    @Res() res: ExpressResponse,
  ) {
    const { email, password } = body ?? {};
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new BadRequestException('Field "email" wajib diisi');
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new BadRequestException('Field "password" wajib diisi');
    }
    try {
      const result = await this.authService.login(email, password);
      const { token, expiresIn, maxAgeMs, ...user } = result as {
        token: string;
        expiresIn: string;
        maxAgeMs: number;
        [k: string]: unknown;
      };
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: maxAgeMs,
      });
      return res.status(200).json({
        status: true,
        code: 200,
        message: 'Logged In',
        data: {
          token,
          expiresIn,
          user,
        },
      });
    } catch (err) {
      const anyErr = err as { getStatus?: () => number; message?: string };
      const code = anyErr?.getStatus?.() ?? 401;
      const message = anyErr?.message ?? 'Unauthorized';
      return res.status(code).json({
        status: false,
        code,
        message,
        data: {},
      });
    }
  }

  @Post('forgot-password')
  @UseInterceptors(AnyFilesInterceptor())
  async forgot(@Body() body: { email?: string }, @Res() res: ExpressResponse) {
    const email = body?.email;
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new BadRequestException('Field "email" wajib diisi');
    }
    const result = await this.authService.forgotPassword(email);
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Jika email terdaftar, instruksi reset telah dikirim',
      data: result,
    });
  }

  @Post('logout')
  logout(@Res() res: ExpressResponse) {
    res.clearCookie('access_token', { sameSite: 'lax' });
    const result = this.authService.logout();
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Logged Out',
      data: result,
    });
  }
}
