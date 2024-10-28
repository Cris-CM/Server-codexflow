// src/auth/dto/login.dto.ts
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  email: string;
  password: string;
}

