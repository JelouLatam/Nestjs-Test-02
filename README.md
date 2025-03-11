# Backend_Developer_NestJS_02

Welcome to the technical test for the NestJS Backend Developer position! In this test, we assess your skills in developing applications using NestJS, with a specific focus on various technical and best practice aspects.

## Project Description

The goal of this project is to build a backend service for a to-do list application using **NestJS**. The service must be dockerized, follow strict linting rules, include database connections, logging (both to files and MongoDB), and use other advanced components provided by the framework.

## Technical Requirements

The application must be developed using the following technologies:

- Framework: NestJS.
- Programming language: TypeScript.
- Database: MySQL for data persistence.
- Docker: The application must be dockerized.

The project must include:

- A controller to manage CRUD operations of the tasks.
- A service that handles the business logic related to the tasks.
- Validations for input data in requests using DTOs.
- Middleware for logging HTTP requests.
- Logging system with support for files and MongoDB.
- Caching for the most accessed endpoints using Redis.
- Rate limiting on the API endpoints.
- Unit and integration tests with at least 80% coverage.
- API documentation using the Swagger module (optional).

### API Endpoints

#### Task Management

- **POST** `/tasks`: Create a new task.
- **GET** `/tasks`: Retrieve all tasks with the ability to filter by status (completed, pending).
- **GET** `/tasks/:id`: Retrieve a specific task by ID.
- **PUT** `/tasks/:id`: Update an existing task (title, description, status).
- **DELETE** `/tasks/:id`: Delete a task by ID.

#### Task Status

- Mark tasks as completed or pending.
- Include a counter indicating how many tasks are completed and how many are pending.

### Dockerization

- Provide a `Dockerfile` file to build the NestJS application Docker image.
- Provide a `docker-compose.yml` file for local deployment of the service.

### Logging

- Implement a full-featured logging system:
  - **File-based logging:** Log all HTTP requests and responses.
  - **MongoDB logging:** Save application logs (e.g. errors, important events) to MongoDB.
- Integrate **Winston** or another logging library that supports multiple transports.

### Security

- Implement **JWT**-based authentication and secure API endpoints.
- Protect sensitive data (e.g. database credentials) using environment variables and make sure they are not exposed.

### Extras

- Implement a metrics endpoint to monitor API performance (e.g. using **Prometheus** or similar).
- Add pagination support for the `GET /tasks` endpoint when there are more than 10 tasks.

## Aspects to Evaluate

During your project review, we will focus on the following aspects:

1. **Working Correctly:** We will verify that the application meets the requirements and works correctly.
2. **Efficiency:** We will evaluate the efficiency of the code, including performance and resource management.
3. **Code Readability:** We will review the code for readability, clarity in structure, and consistency in naming conventions.
4. **Formatting and Code Style:** We will verify the use of tools such as linter to maintain consistent and prettier code formatting.
5. **Project Organization:** Evaluate the structure and organization of the source code.

## Tasks to Perform

1. Implement the task management service with the functionalities described above.
2. Create a `Dockerfile` file to build the Docker image of the application.
3. Create a `docker-compose.yml` file for local deployment of the service.
4. Perform a code review to evaluate the quality of the code readability.
5. Use a linter and prettier to ensure the quality and style of the code.
6. Verify the correct operation of the application.

## Test Delivery

- Deliver your source code by forking the repository provided for the test.
- The name of the branch must follow the following convention: `test/person-name`.
- Add clear instructions on how to run and test the application to the end of the `README.md` file.
- As well as the necessary documentation to test the API with sample requests.

Good luck and we look forward to reviewing your work!
