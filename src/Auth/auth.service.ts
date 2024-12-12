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
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      // Crear usuario en Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: registerDto.email,
        password: registerDto.password,
        displayName: registerDto.nombre,
      });

      // Guardar datos adicionales en Firestore
      const db = admin.firestore();
      await db.collection('users').doc(userRecord.uid).set({
        nombre: registerDto.nombre,
        email: registerDto.email,
        fechaNacimiento: registerDto.fechaNacimiento,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Devolver respuesta con token y datos del usuario
      return {
        message: '¡Registro exitoso!',
        nombre: userRecord.displayName || '',
        id: userRecord.uid,
        email: userRecord.email || '',
        age: this.calculateAge(registerDto.fechaNacimiento),
      
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new HttpException(
          'El correo ya está registrado',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      // Verificar usuario por email
      const userRecord = await admin.auth().getUserByEmail(loginDto.email);
      
      // Crear token personalizado
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      // Obtener datos adicionales de Firestore
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      if (!userData) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        message: '¡Inicio de sesión exitoso!',
        nombre: userRecord.displayName || '',
        id: userRecord.uid,
        email: userRecord.email || '',
        token: customToken,
        age: this.calculateAge(userData.fechaNacimiento),
      };
    } catch (error) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private calculateAge(fechaNacimiento: string): number {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
