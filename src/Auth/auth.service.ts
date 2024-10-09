// src/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    getLastLoginData(): LoginDto {
        throw new Error('Method not implemented.');
    }
    private loginAttempts: { email: string; password: string; edad: number; nombre: string }[] = []; // Almacenar todos los intentos de inicio de sesión

    async login(loginDto: LoginDto): Promise<{ message: string; age: number }> {
        try {
            // Verificar si el correo electrónico termina en @gmail.com
            if (!loginDto.email.endsWith('@gmail.com')) {
                throw new HttpException('El correo electrónico debe ser una dirección de Gmail', HttpStatus.FORBIDDEN);
            }

            // Verificar si el correo electrónico ya ha sido utilizado
            const existingAttempt = this.loginAttempts.find(attempt => attempt.email === loginDto.email);
            if (existingAttempt) {
                // Si el correo ya existe, verificar si la contraseña es la misma
                if (existingAttempt.password === loginDto.password) {
                    throw new HttpException('Esta combinación de correo electrónico y contraseña ya ha sido utilizada.', HttpStatus.CONFLICT);
                }
            }

            // Almacenar los datos del intento de inicio de sesión
            this.loginAttempts.push({
                email: loginDto.email,
                password: loginDto.password,
                edad: loginDto.edad,
                nombre: loginDto.nombre
            });

            return { message: '¡Inicio de sesión exitoso!', age: loginDto.edad };
        } catch (error) {
            console.error('Error en AuthService:', error);
            throw new HttpException(`Error de autenticación: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obtener todos los intentos de inicio de sesión
    getAllLoginAttempts(): { email: string; password: string; edad: number; nombre: string }[] {
        return this.loginAttempts;
    }
}
