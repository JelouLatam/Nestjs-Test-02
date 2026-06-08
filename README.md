# Jelou NestJS-Test-02 API

## Project Overview

This project is a backend service for a to-do list application built with **NestJS**. It demonstrates best practices in API design, authentication, caching, logging, testing, and documentation.

## How Requirements Were Met

- **NestJS + TypeScript:** The project is fully developed using NestJS and TypeScript.
- **Dockerization:** Includes `Dockerfile` and `docker-compose.yml` for easy containerization and deployment.
- **Database:** Uses MySQL for data persistence, configured via environment variables.
- **Task Management:** Implements CRUD operations for tasks, with endpoints for creation, retrieval, update, and deletion.
- **DTO Validation:** All request bodies are validated using DTOs and class-validator.
- **Logging:** HTTP requests are logged to files; application logs and errors are sent to MongoDB using Winston.
- **Caching:** Frequently accessed endpoints use Redis for caching.
- **Rate Limiting:** API endpoints are protected against abuse with rate limiting.
- **Authentication:** JWT-based authentication secures all protected endpoints.
- **Testing:** Includes unit and integration tests with >80% coverage. Run `npm run test` to verify.
- **Linting & Formatting:** Uses ESLint and Prettier for code style and quality.
- **API Documentation:** Swagger UI is available at `/api` for interactive documentation and testing.
- **Pagination:** The `GET /tasks` endpoint supports pagination and filtering by status.
- **Task Status Counter:** The `/tasks/status-count` endpoint returns the count of completed and pending tasks.

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login and obtain a JWT token.

### Task Management

- **POST /tasks**: Create a new task.
- **GET /tasks**: Retrieve all tasks (supports pagination and status filter).
- **GET /tasks/:id**: Retrieve a specific task by ID.
- **PUT /tasks/:id**: Update a task.
- **DELETE /tasks/:id**: Delete a task.
- **PATCH /tasks/:id/status**: Update the status of a task.
- **GET /tasks/status-count**: Get count of completed and pending tasks.

## How to Run the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Set up your database and environment variables (see `.env.example`).
3. **Start the application:**
   ```bash
   npm run start:dev
   ```
   Or with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. **Access Swagger API docs:**
   - Open [http://localhost:3000/api](http://localhost:3000/api) in your browser.

## How to Test the Application

- **Run unit and integration tests:**
  ```bash
  npm run test
  ```
- **Run lint checks:**
  ```bash
  npm run lint
  ```

## Authentication Flow

1. **Register a new user:**
   ```http
   POST /auth/register
   Content-Type: application/json
   {
     "username": "newuser",
     "password": "pass123",
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@email.com"
   }
   ```
2. **Login to obtain JWT token:**
   ```http
   POST /auth/login
   Content-Type: application/json
   {
     "username": "newuser",
     "password": "pass123"
   }
   ```
   - The response will include an `access_token`.
3. **Authorize in Swagger UI:**
   - Click the "Authorize" button and paste your JWT token.

## Example Requests

### Create a Task
```http
POST /tasks
Content-Type: application/json
Authorization: Bearer <your_token>
{
  "title": "My Task",
  "description": "Optional description"
}
```

### Get Paginated Tasks
```http
GET /tasks?page=1&limit=10
Authorization: Bearer <your_token>
```

### Update Task Status
```http
PATCH /tasks/1/status
Content-Type: application/json
Authorization: Bearer <your_token>
{
  "status": "COMPLETED"
}
```

### Get Task Status Count
```http
GET /tasks/status-count
Authorization: Bearer <your_token>
```

## Notes
- All protected endpoints require a valid JWT token.
- Use Swagger UI for interactive API testing and documentation.
