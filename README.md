# 🚀 CodeArena Backend

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/vishalrathore8oct/codearena-server#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/vishalrathore8oct/codearena-server/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/vishalrathore8oct/codearena-server/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/vishalrathore8oct/codearena-server" />
  </a>
  <a href="https://x.com/vishalrathore66" target="_blank">
    <img alt="X: @vishalrathore66" src="https://img.shields.io/twitter/follow/vishalrathore66.svg?style=social" />
  </a>
</p>

---

## 📖 Overview

**CodeArena** is a powerful, highly scalable backend application designed to power a modern competitive programming platform. Built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**, it exposes a robust set of RESTful APIs to manage users, coding problems, code compilation, and evaluation.

By integrating with the **Judge0 API**, CodeArena can execute code in real-time, matching user outputs against strict test cases, memory limits, and time constraints.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- **JWT-based Security:** Secure login flow with short-lived access tokens and robust refresh token rotation.
- **Role-Based Access Control (RBAC):** Distinct `USER` and `ADMIN` privileges.
- **Account Recovery & Verification:** Secure email verification workflows and password reset via `nodemailer` and `mailgen`.

### 🧠 Problem & Content Management

- **Extensive Problem Model:** Support for difficulty levels, tags, hints, runtime constraints, examples, hidden testcases, and reference solutions.
- **Admin Dashboard APIs:** Powerful CRUD endpoints strictly guarded for administrators to build the platform's question bank.

### ⚙️ Code Execution Engine (Judge0)

- **Open-Source Powerhouse:** Powered by **Judge0**, a robust, open-source online code execution system.
- **Real-Time Code Evaluation:** Users submit code that gets routed securely to the Judge0 execution environment for compilation and execution.
- **Automated Grading:** Compares output with expected answers, capturing `stdout`, `stderr`, memory usage, compilation status, and execution time.
- **Submission History:** Persistent tracking of user attempts, test case results, and problem resolution status.

### 📁 Playlists & Curation

- Users can create, update, and delete **Problem Playlists**.
- Bookmark and organize coding problems for structured learning paths.

### 🛠 Architecture & Dev Experience

- **Code Quality & Formatting:** Automated linting and formatting strictly maintained via **ESLint** and **Prettier**.
- **Git Hooks:** Enforced pre-commit checks and formatting using **Husky** alongside **lint-staged**.
- **Validation:** Strict, type-safe request parsing using **Zod** schema validation.
- **Centralized Error Handling:** Consistent API error responses avoiding unhandled exceptions.
- **Logging:** Advanced request and error logging powered by **Winston** and **Morgan**.
- **Media Uploads:** Seamless image uploads (like user avatars) stored safely via **Cloudinary**.
- **API Documentation:** Fully documented with **Swagger UI**.

---

## 💻 Tech Stack

| Category                | Technology                        |
| :---------------------- | :-------------------------------- |
| **Runtime & Framework** | Node.js, Express.js (v5)          |
| **Language**            | TypeScript                        |
| **Database & ORM**      | PostgreSQL, Prisma ORM            |
| **Code Execution**      | Judge0 API                        |
| **Validation**          | Zod                               |
| **Authentication**      | JSON Web Tokens (JWT), bcrypt     |
| **Cloud & Media**       | Cloudinary, Multer                |
| **Mail Services**       | Nodemailer, Mailgen               |
| **Logging**             | Winston, Morgan                   |
| **Documentation**       | Swagger UI (`swagger-ui-express`) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **PostgreSQL** database instance
- **Judge0** (Self-hosted or Cloud API Key)
- **Cloudinary** Account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vishalrathore8oct/codearena-server.git
   cd codearena-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   ```bash
   cp env.sample .env
   ```

   _Edit `.env` and fill in your database, JWT, SMTP, Judge0, and Cloudinary credentials. (See Environment Variables section below)._

---

## ⚙️ Environment Variables

Your `.env` file should look like this:

```env
# Application Settings
PORT=4000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
APP_BASE_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173

# Database configuration
DATABASE_URL=your_database_url

# Authentication secrets
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRES_IN=14d

# Nodemailer / SMTP config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Code Execution Engine
JUDGE0_API_URL=http://localhost:2358/docs
```

---

4. **Initialize Database:**

   ```bash
   # Run Prisma migrations and generate Prisma Client
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 📜 API Documentation

Once your server is running, you can explore, test, and interact with the endpoints directly through the built-in Swagger UI dashboard:

**Navigate to:**  
👉 `http://localhost:4000/api-docs`

---

## 📂 Project Structure

A clean, modular, and scalable folder structure:

```
server/
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Prisma models (User, Problem, Submission, etc.)
├── src/
│   ├── config/             # Environment & App configs
│   ├── controllers/        # Route logic & request handling
│   ├── db/                 # Database connection utilities
│   ├── logger/             # Winston logger configuration
│   ├── middlewares/        # Auth, Validation, File Upload, Error Handling
│   ├── routes/             # Express API route definitions
│   ├── services/           # External service integration (Email, Judge0)
│   ├── types/              # Global TypeScript types & interfaces
│   ├── utils/              # Helpers (ApiError, ApiResponse, Tokens, etc.)
│   ├── validations/        # Zod validation schemas
│   ├── app.ts              # Express App setup & middleware injection
│   └── main.ts             # Server entry point
├── package.json
└── env.sample
```

---

## 🔧 Scripts

| Task           | Command          | Description                                      |
| :------------- | :--------------- | :----------------------------------------------- |
| **Start Dev**  | `npm run dev`    | Starts server with `tsx watch` for hot-reloading |
| **Build**      | `npm run build`  | Compiles TypeScript down to standard JavaScript  |
| **Start Prod** | `npm start`      | Runs the compiled application (`dist/main.js`)   |
| **Lint**       | `npm run lint`   | Lints the codebase using ESLint                  |
| **Format**     | `npm run format` | Formats files using Prettier                     |

---

## 👤 Author

**Vishal Rathore**

- GitHub: [@vishalrathore8oct](https://github.com/vishalrathore8oct)
- X / Twitter: [@vishalrathore66](https://x.com/vishalrathore66)
- LinkedIn: [Vishal Rathore](https://www.linkedin.com/in/vishalrathore8oct/)
- Blog: [vishalrathore.hashnode.dev](https://vishalrathore.hashnode.dev/)

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/vishalrathore8oct/codearena-server/issues) or submit a pull request.

---

## ⭐ Show Your Support

If this project helped you or you learned something new, please give it a ⭐️ on GitHub!

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
