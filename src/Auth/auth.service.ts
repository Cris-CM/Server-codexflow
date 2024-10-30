// src/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private registeredUsers: RegisterDto[] = [];

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = this.registeredUsers.find(
      (user) => user.email === registerDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        'Este correo electrónico ya está registrado.',
        HttpStatus.CONFLICT,
      );
    }
    this.registeredUsers.push(registerDto);
    return { message: '¡Registro exitoso!' };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Buscar usuario
    const user = this.registeredUsers.find(u => u.email === email);
    
    // Validar si existe el usuario
    if (!user) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Validar contraseña
    if (user.password !== password) {
      throw new HttpException(
        'Contraseña incorrecta',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Retornar respuesta
    return {
      message: '¡Inicio de sesión exitoso!',
      nombre: user.nombre || email.split('@')[0],
      id: user.id || Date.now().toString(),
      email: user.email
    };
  }

  async googleLogin(user: any): Promise<{ message: string }> {
    const existingUser = this.registeredUsers.find(
      (u) => u.email === user.email,
    );
    if (!existingUser) {
      this.registeredUsers.push(user);
      return { message: 'Usuario registrado con Google' };
    }
    return { message: 'Usuario ya registrado' };
  }

  getAllRegisteredUsers(): RegisterDto[] {
    return this.registeredUsers;
  }
}
