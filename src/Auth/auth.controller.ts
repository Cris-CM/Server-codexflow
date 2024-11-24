// src/auth/auth.controller.ts
import {
  Controller,Post,Get,Body,UsePipes,ValidationPipe,UseGuards,Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @Get('register')
  getAllRegisteredUsers(): RegisterDto[] {
    return this.authService.getAllRegisteredUsers();
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; userName: string }> {
    const user = await this.authService.login(loginDto);
    return { message: '¡Inicio de sesión exitoso!', userName: user.nombre };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
