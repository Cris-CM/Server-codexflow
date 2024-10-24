// src/auth/dto/register.dto.ts
import { IsString, IsEmail, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDateString()
  fechaNacimiento: string;
}