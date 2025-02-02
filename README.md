# 📝 ToDo API - NestJS

This project is a **ToDo List API** built with **NestJS**, featuring authentication, task management, and integration with **MySQL**, **MongoDB** (for logs), and **Redis** (for caching). Additionally, it logs requests and response times locally in files for better debugging and monitoring.

---

## 📂 Project Structure

This API follows NestJS's modular structure:

```
src
│── auth/               # Authentication module
│── tasks/              # Task management module
│── config/             # System configuration
│── middleware/         # Custom middleware (logging, authentication)
│── utils/              # Utility functions
│── main.ts             # Application entry point
│── app.module.ts       # Main application module
│── logs/               # Local logs (requests & response times)
```

---

## 🚀 Running the Application

You can run this API either **locally** (without Docker) or using **Docker** containers.

### 1️⃣ Running Locally (Development Mode)

**Prerequisites:**
- **Node.js** (v18 or higher)
- **MySQL**, **MongoDB**, and **Redis** installed locally
- A `.env` file with credentials for the database and caching services

#### 📌 Steps to Run Locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/todo-api.git
   cd todo-api
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**  
   Copy the `.env.example` file and rename it to `.env`.  
   Fill in the required credentials (database connection, JWT secret, etc.).

4. **Ensure MySQL, MongoDB, and Redis are running**  
   If you're running these services locally, start them before running the API.

5. **Run the application in development mode**
   ```sh
   npm run start:dev
   ```

6. **Access the API**
   - API Base URL: [http://localhost:3000](http://localhost:3000)
   - **Swagger Documentation**: [http://localhost:3000/api](http://localhost:3000/api)
   - Local logs will be stored in the `/logs` folder

---

### 2️⃣ Running with Docker (Recommended for Production)

**Prerequisites:**
- **Docker**
- **Docker Compose**

#### 📌 Steps to Run with Docker:

1. **Build and start the containers**
   ```sh
   docker-compose up --build
   ```

2. **Access the API**
   - API Base URL: [http://localhost:3000](http://localhost:3000)
   - **Swagger Documentation**: [http://localhost:3000/api](http://localhost:3000/api)

3. **Stopping the containers**
   ```sh
   docker-compose down
   ```

---

## 🛠 Available Scripts

| Command                 | Description                                     |
|-------------------------|-----------------------------------------------|
| `npm run start`         | Starts the application in local mode          |
| `npm run start:dev`     | Starts in **watch mode** (auto-restart on changes) |
| `npm run build`         | Compiles the project                          |
| `npm run lint`          | Runs ESLint for static analysis               |
| `npm run test`          | Runs unit tests using **Jest**                |
| `npm run test:e2e`      | Runs end-to-end tests                         |

---

## 🛠 Technologies Used

- **NestJS** (Backend Framework)
- **TypeORM** (MySQL ORM)
- **JWT + Passport** (Authentication)
- **Redis** (Caching)
- **MongoDB** (Logging)
- **Winston** (File logging)
- **Jest** (Testing framework)
- **Swagger** (API Documentation)
- **Docker & Docker Compose** (Containerization)

---

## 📝 Logging

This API includes:
- **MongoDB logs**: Stored for long-term tracking.
- **Local logs**: Requests and response times are logged in files within the `/logs` directory.



