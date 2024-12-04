import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(
    'codexflow-ae4fb-firebase-adminsdk-27sr9-9e0e1f8cb9.json',
  ),
});

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    try {
      const userRecord = await admin.auth().createUser({
        email: registerDto.email,
        password: registerDto.password,
        displayName: registerDto.nombre,
      });

      const db = admin.firestore();
      await db.collection('users').doc(userRecord.uid).set({
        nombre: registerDto.nombre,
        email: registerDto.email,
        fechaNacimiento: registerDto.fechaNacimiento,
      });

      return { message: '¡Registro exitoso!' };
    } catch (error) {
      throw new HttpException(
        'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const userRecord = await admin.auth().getUserByEmail(loginDto.email);
      // Aquí deberías verificar la contraseña usando un método seguro

      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      if (!userData) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Calcular la edad del usuario
      const birthDate = new Date(userData.fechaNacimiento);
      const age = new Date().getFullYear() - birthDate.getFullYear();

      return {
        message: '¡Inicio de sesión exitoso!',
        nombre: userRecord.displayName || '',
        id: userRecord.uid,
        email: userRecord.email || '',
        age, // Devuelve la edad calculada
      };
    } catch (error) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
