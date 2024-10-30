// src/auth/dto/register.dto.ts
import { IsString, IsEmail, IsDateString } from 'class-validator';

export class RegisterDto {
  id?: string;
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  nombre?: string;
}
