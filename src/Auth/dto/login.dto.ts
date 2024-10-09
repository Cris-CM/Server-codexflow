// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsNumber() // Asegúrate de que esto esté presente
    edad: number; // Mantener como number
}