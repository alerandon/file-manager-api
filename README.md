<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">File Manager API</h1>

<p align="center">
  Una API construida con <a href="http://nestjs.com/" target="_blank">NestJS</a> para la gestión eficiente de archivos.
</p>

---

## Requerimientos técnicos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu sistema:

- [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (para ejecutar el proyecto en contenedores)

---

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/file-manager-api.git
   cd file-manager-api
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

---

## Ejecución del proyecto con Docker

Para facilitar la ejecución del proyecto, puedes usar Docker y Docker Compose. Sigue los pasos a continuación:

1. Construye y ejecuta el proyecto con el siguiente comando:

   ```bash
   docker compose up --build --watch
   ```

   Este comando construirá las imágenes necesarias y levantará los contenedores, incluyendo la aplicación principal.

2. Mientras el proyecto está corriendo en Docker, puedes ejecutar las pruebas unitarias con el siguiente comando:

   ```bash
   docker compose exec app npm run test
   ```

   Esto ejecutará las pruebas dentro del contenedor de la aplicación.

---

## Recursos adicionales

- [Documentación oficial de NestJS](https://docs.nestjs.com)
- [Guía de Docker Compose](https://docs.docker.com/compose/)

---

## Licencia

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).
