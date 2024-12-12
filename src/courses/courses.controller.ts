import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
// ... existing code ...
import { UploadedFile, UseInterceptors } from '@nestjs/common'; // Asegúrate de importar UploadedFile
import { FileInterceptor } from '@nestjs/platform-express'; // Asegúrate de importar FileInterceptor
import { diskStorage } from 'multer'; // Asegúrate de importar diskStorage
// ... existing code ...

@Controller('courses')
export class CoursesController {
  private courses = []; // Simulación de base de datos

  @Get('list')
  listCourses(@Res() res: Response): void {
    res.status(200).json(this.courses);
  }

  @Post('create')
  createCourse(@Body() body: any, @Res() res: Response): void {
    try {
      const {
        nombreCurso,
        descripcionCurso,
        courseLevel,
        ageRange,
        nombreDocente,
        descripcionDocente,
        courseImage, // Enlace de la imagen del curso
        docenteImage, // Enlace de la imagen del docente
      } = body;

      const newCourse = {
        nombreCurso,
        descripcionCurso,
        courseLevel,
        ageRange,
        nombreDocente,
        descripcionDocente,
        courseImage,
        docenteImage,
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
          <link rel="stylesheet" href="/desccurso/desccurso.css" />
          <link rel="icon" href="../img/logo.png" />
      </head>
      <body>
          <header>
              <nav>
                  <div class="logo">
                      <img src="/Client/Images/images/MISLOGOS/logocodex.png" alt="ShinkaToMirai Logo" />
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
                      <img src="${courseImage}" alt="Usuario" />
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
                      <p>${nombreDocente}</p>
                      <button class="btn-curso">Ir al curso</button>
                  </div>
              </section>
              <nav class="curso-nav">
                  <ul>
                      <li><a href="#reseñas" class="active" onclick="showSection('reseñas')">Reseñas</a></li>
                      <li><a href="#instructores" onclick="showSection('instructores')">Instructores</a></li>
                  </ul>
                  <hr />
              </nav>
              <section class="curso-reseñas" id="reseñas">
                  <h2>Comentarios de los estudiantes</h2>
                  <div class="reseñas">
                      <aside class="comments">
                          <h3>Comentarios</h3>
                          <div class="comment-box">
                              <textarea placeholder="Escribe tu comentario aquí..."></textarea>
                              <button id="post-comment">Publicar</button>
                          </div>
                          <div class="comment-list">
                              <!-- Los comentarios se agregarán aquí -->
                          </div>
                      </aside>
                  </div>
              </section>
              <section class="curso-instructores" id="instructores">
                  <h2>Instructor</h2>
                  <div class="instructor-info">
                      <img src="${docenteImage}" alt="nose" class="instructor-avatar" />
                      <div class="instructor-details">
                          <p><strong>${nombreDocente}</strong></p>
                          <p>${descripcionDocente}</p>
                      </div>
                  </div>
              </section>
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
          <script src="desccurso.js"></script>
          <script src="/Client/Js/common.js"></script>
      </body>
      </html>
      `;

      const directoryPath =
        'C:/Users/Liz/Documents/GitHub/codexflow/Client/pages/Courses/Courses_template';
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

        // After creating the course HTML, update the home page
        const homeFilePath =
          'C:/Users/Liz/Documents/GitHub/codexflow/Client/pages/Home/home.html';
        try {
          let homeContent = fs.readFileSync(homeFilePath, 'utf8');

          // Create the new course card HTML
          const courseCard = `
                  <div class="course-card">
                      <img src="${courseImage}" alt="${nombreCurso}" class="course-image">
                      <div class="course-content">
                          <h3 class="course-title">${nombreCurso}</h3>
                          <p class="course-description">${descripcionCurso}</p>
                          <div class="course-buttons">
                              <button class="course-btn course-btn-primary">Ver sesiones</button>
                              <button class="course-btn course-btn-secondary">Ir a Evaluación</button>
                          </div>
                      </div>
                  </div>
                  <!-- Los cursos se generarán dinámicamente aquí -->`;

          // Insert the new course card before the comment
          homeContent = homeContent.replace(
            '<!-- Los cursos se generarán dinámicamente aquí -->',
            courseCard,
          );

          fs.writeFileSync(homeFilePath, homeContent);
          console.log('Home page updated successfully');

          // Continue with the existing response
          res
            .status(201)
            .send(
              `Curso creado: <a href="/Client/pages/Courses/Courses_template/${nombreCurso.replace(/\s+/g, '_')}.html">Ver curso</a>`,
            );
        } catch (error) {
          console.error('Error updating home page:', error);
          res.status(500).send('Error al crear el curso');
        }
      } catch (error) {
        console.error('Error al crear el archivo:', error);
        res.status(500).send('Error al crear el curso');
      }
    } catch (error) {
      console.error('Error:', error);
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

  @Post('create-video')
  @UseInterceptors(
    FileInterceptor('videoFile', {
      storage: diskStorage({
        destination: './Client/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  createVideo(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): void {
    try {
      const { videoTitle, videoDescription, courseId } = body;

      const videoUrl = file ? `/Client/videos/${file.filename}` : '';

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${videoTitle}</title>
          <link rel="stylesheet" href="/Client/pages/Courses/Courses_template/CURSOS/curso_video.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      </head>
      <body class="theme03">
          <div class="container">
              <div class="main-content">
                  <div class="video-container">
                      <video id="videoPlayer" controls>
                          <source src="${videoUrl}" type="video/mp4">
                          Tu navegador no soporta el elemento de video.
                      </video>
                  </div>
                  <h1 id="videoTitle">${videoTitle}</h1>
                  <div class="video-description">
                      <p id="videoDescription">${videoDescription}</p>
                      <button id="showMoreBtn">Mostrar más</button>
                  </div>
                  <div class="comments-section">
                      <h2>Comentarios</h2>
                      <div class="comment-input">
                          <textarea id="commentInput" placeholder="Añade un comentario..."></textarea>
                          <button id="submitComment">Comentar</button>
                      </div>
                      <div id="commentsList"></div>
                  </div>
              </div>
              <div class="sidebar">
                  <h2>Lista de reproducción</h2>
                  <div id="playlist"></div>
              </div>
          </div>
          <script src="/Client/pages/Courses/Courses_template/CURSOS/curso_video.js"></script>
      </body>
      </html>
      `;

      const directoryPath =
        'C:/Users/Liz/Documents/GitHub/codexflow/Client/pages/Courses/Courses_template/route videos';
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      const filePath = path.join(
        directoryPath,
        `${videoTitle.replace(/\s+/g, '_')}.html`,
      );

      fs.writeFileSync(filePath, htmlContent);
      res.status(201).json({
        message: 'Video creado exitosamente',
        path: `/Client/pages/Courses/Courses_template/route videos/${videoTitle.replace(/\s+/g, '_')}.html`,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error al crear el video');
    }
  }
}
