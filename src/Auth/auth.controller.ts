// src/auth/auth.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginDto: LoginDto): Promise<{ message: string; age: number }> { // Cambiado a objeto JSON
        return this.authService.login(loginDto);
    }

    @Get('last-login') // Nuevo endpoint para obtener los datos del último inicio de sesión
    getLastLoginData(): LoginDto | null {
        return this.authService.getLastLoginData();
    }

    @Get('login-attempts') // Nuevo endpoint para obtener todos los intentos de inicio de sesión
    getAllLoginAttempts(): LoginDto[] {
        return this.authService.getAllLoginAttempts();
    }
}