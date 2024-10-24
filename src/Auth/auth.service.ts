// src/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

  async login(loginDto: LoginDto): Promise<{
      nombre: string; message: string 
}> {
    const user = this.registeredUsers.find(
      (user) =>
        user.email === loginDto.email && user.password === loginDto.password,
    );
    if (!user) {
      throw new HttpException(
        'Credenciales incorrectas.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { message: '¡Inicio de sesión exitoso!', nombre: user.nombre };
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
