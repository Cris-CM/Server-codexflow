// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Asegúrate de que esta línea esté presente

@Module({
    imports: [AuthModule], // Asegúrate de que el módulo de autenticación esté importado
    controllers: [],
    providers: [],
})
export class AppModule {}