import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { Express, Response } from 'express';

@Controller('courses')
export class CoursesController {
  private courses = []; // Simulación de base de datos

  @Get('list')
  listCourses(@Res() res: Response): void {
    res.status(200).json(this.courses);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('courseImage', { dest: './uploads' }))
  createCourse(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): void {
    const {
      nombreCurso,
      descripcionCurso,
      courseLevel,
      ageRange,
      nombreDocente,
      descripcionDocente,
    } = body;
    const courseImage = file
      ? `/uploads/${file.filename}`
      : 'default-image.png';

    const newCourse = {
      nombreCurso,
      descripcionCurso,
      courseLevel,
      ageRange,
      nombreDocente,
      descripcionDocente,
      courseImage,
    };
    this.courses.push(newCourse); // Guardar el curso en la simulación de base de datos

    // Crear el archivo HTML del curso
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${nombreCurso}</title>
        <link rel="stylesheet" href="/Client/Styles/courses_development.css">
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <img src="/ShinkaMirai/Client/Images/Guimarbot.png" alt="ShinkaToMirai Logo" />
                    <span>ShinkaToMirai</span>
                </div>
                <div class="search-bar">
                    <input type="text" placeholder="¿Qué quieres aprender?" />
                </div>
                <ul class="nav-links">
                    <li><a href="/Client/pages/Courses/1Courses_page/Courses.html">Cursos</a></li>
                    <li><a href="/Client/pages/Plans/plans.html">Planes</a></li>
                    <li><a href="">Contáctanos</a></li>
                </ul>
                <div class="user-menu">
                    <img src="/Client/Images/pikachu.png" alt="Usuario" />
                    <div class="dropdown-menu">
                        <p>Hola, <span class="user-name">Usuario</span></p>
                        <a href="#" onclick="window.location.href='/Client/pages/Courses/Courses.html'">Ver todos mis cursos</a>
                        <a href="#" onclick="window.location.href='/Client/pages/Auth/profile.html'">Ver mi perfil</a>
                        <a href="#" onclick="window.location.href='/Client/pages/Plans/plans.html'">Mis planes</a>
                        <a href="#">Mi Suscripción</a>
                        <a href="#">Contáctanos</a>
                        <a href="#">Configuración</a>
                        <a href="#" class="logout">Cerrar sesión</a>
                    </div>
                </div>
            </nav>
        </header>
        <main>
            <section class="web-development">
                <img src="${courseImage}" alt="${nombreCurso}" class="img-desarrollo" />
                <div class="web-content">
                    <h1>${nombreCurso}</h1>
                    <p>${descripcionCurso}</p>
                    <p>Creado por ${nombreDocente}</p>
                    <button class="btn-curso">Ir al curso</button>
                </div>
                <div class="instructor-info">
                    <img src="${courseImage}" alt="${nombreDocente}" class="instructor-avatar" />
                    <div class="instructor-details">
                        <p><strong>${nombreDocente}</strong></p>
                        <p>${descripcionDocente}</p>
                        <p>Calificación del instructor:</p>
                        <p>Estoy aquí para ayudarte a aprender, a alcanzar tus sueños...</p>
                    </div>
                </div>
            </section>
            <nav class="curso-nav">
                <ul>
                    <li><a href="#reseñas" class="active">Reseñas</a></li>
                    <li><a href="#instructores">Instructores</a></li>
                </ul>
                <hr />
            </nav>
            <div class="contenido-seccion">
                <section class="curso-reseñas" id="reseñas" style="display: block">
                    <h2>Comentarios de los estudiantes</h2>
                    <div class="reseñas">
                        <aside class="comments">
                            <h3>Comentarios</h3>
                            <div class="comment-box">
                                <textarea id="comment-input" placeholder="Escribe tu comentario aquí..."></textarea>
                                <button id="post-comment">Publicar</button>
                            </div>
                            <div class="comment-list" id="comment-list">
                                <!-- Los comentarios se agregarán aquí -->
                            </div>
                        </aside>
                    </div>
                </section>
                <section class="curso-instructores" id="instructores" style="display: none">
                    <h2>Instructor</h2>
                    <div class="instructor-info">
                        <img src="${courseImage}" alt="${nombreDocente}" class="instructor-avatar" />
                        <div class="instructor-details">
                            <p><strong>${nombreDocente}</strong></p>
                            <p>${descripcionDocente}</p>
                            <p>Calificación del instructor:</p>
                            <p>Estoy aquí para ayudarte a aprender, a alcanzar tus sueños...</p>
                        </div>
                    </div>
                </section>
            </div>
            <section class="cursos-recomendados">
                <h2>Cursos Recomendados</h2>
                <div class="carousel">
                    <button class="carousel-btn prev-btn">⬅</button>
                    <div class="carousel-content">
                        <section class="learning-path">
                            <h2>Rutas de aprendizaje</h2>
                            <div class="course-grid">
                                <!-- Aquí se añadirán las rutas -->
                            </div>
                        </section>
                    </div>
                    <button class="carousel-btn next-btn">➡</button>
                </div>
            </section>
        </main>
        <script src="/Client/Js/common.js"></script>
        <script src="/Client/Js/courses_development.js"></script>
    </body>
    </html>
    `;

    const directoryPath = path.join(
      'C:/Users/Liz/Documents/GitHub/codexflow/Client/pages/Courses/Courses_template',
    );
    const filePath = path.join(
      directoryPath,
      `${nombreCurso.replace(/\s+/g, '_')}.html`,
    );

    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      fs.writeFileSync(filePath, htmlContent);
      console.log(`Archivo HTML creado en: ${filePath}`);
      res
        .status(201)
        .send(
          `Curso creado: <a href="/Client/pages/Courses/Courses_template/${nombreCurso.replace(/\s+/g, '_')}.html">Ver curso</a>`,
        );
    } catch (error) {
      console.error('Error al crear el archivo:', error);
      res.status(500).send('Error al crear el curso');
    }
  }

  @Post('add-route')
  addRoute(@Body() body: any, @Res() res: Response): void {
    console.log('Datos recibidos:', body);

    const {
      nombreRuta,
      descripcionRuta,
      nivelRuta,
      duracionRuta,
      nombreCurso,
    } = body;

    if (
      !nombreCurso ||
      !nombreRuta ||
      !descripcionRuta ||
      !nivelRuta ||
      !duracionRuta
    ) {
      res.status(400).send('Datos inválidos: todos los campos son requeridos.');
      return;
    }

    const routeHtmlContent = `
    <article class="course-card">
      <span class="tag">RUTA</span>
      <h3>${nombreRuta}</h3>
      <p>${descripcionRuta}</p>
      <div class="course-meta">
        <span>0 cursos</span>
        <span>${duracionRuta} horas</span>
      </div>
      <button class="cta-button">Conocer ruta</button>
    </article>
    `;

    const filePath = path.join(
      'C:/Users/Liz/Documents/GitHub/codexflow/Client/pages/Courses/Courses_template',
      `${nombreCurso.replace(/\s+/g, '_')}.html`,
    );

    try {
      if (!fs.existsSync(filePath)) {
        res.status(404).send('El archivo del curso no existe.');
        return;
      }

      let htmlContent = fs.readFileSync(filePath, 'utf8');
      htmlContent = htmlContent.replace(
        '<!-- Aquí se añadirán las rutas -->',
        `${routeHtmlContent}<!-- Aquí se añadirán las rutas -->`,
      );
      fs.writeFileSync(filePath, htmlContent);
      console.log(`Ruta añadida al archivo HTML: ${filePath}`);
      res.status(200).send('Ruta añadida exitosamente');
    } catch (error) {
      console.error('Error al añadir la ruta:', error);
      res.status(500).send('Error al añadir la ruta');
    }
  }
}
