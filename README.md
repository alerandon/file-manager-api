<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">File Manager API</h1>

<p align="center">
  An API built with <a href="http://nestjs.com/" target="_blank">NestJS</a> for efficient file management.
</p>

---

## Technical Requirements

Before starting, make sure you have the following components installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (to run the project in containers)

---

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/file-manager-api.git
   cd file-manager-api
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

---

## Running the Project with Docker

To simplify running the project, you can use Docker and Docker Compose. Follow the steps below:

1. Build and run the project with the following command:

   ```bash
   docker compose up --build --watch
   ```

   This command will build the necessary images and start the containers, including the main application.

2. While the project is running in Docker, you can execute unit tests with the following command:

   ```bash
   docker compose exec app npm run test
   ```

   This will run the tests inside the application container.

---

## Additional Resources

- [Official NestJS Documentation](https://docs.nestjs.com)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
