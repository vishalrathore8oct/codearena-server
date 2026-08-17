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

**DevArena** is a powerful, highly scalable backend application designed to power a modern competitive programming platform. Built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**, it exposes a robust set of RESTful APIs to manage users, coding problems, code compilation, and evaluation.

By integrating with the **Judge0 API**, DevArena can execute code in real-time, matching user outputs against strict test cases, memory limits, and time constraints.

The backend is designed to work with the **DevArena Frontend**, providing authentication, problem management, code execution, submissions, playlists, and other APIs consumed by the client application.

### 🔗 Related Repository

**Frontend:**
https://github.com/vishalrathore8oct/codearena-client

**Backend:**
https://github.com/vishalrathore8oct/codearena-server

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* **JWT-based Security:** Secure login flow with short-lived access tokens and robust refresh token rotation.
* **Role-Based Access Control (RBAC):** Distinct `USER` and `ADMIN` privileges.
* **Account Recovery & Verification:** Secure email verification workflows and password reset via `nodemailer` and `mailgen`.

### 🧠 Problem & Content Management

* **Extensive Problem Model:** Support for difficulty levels, tags, hints, runtime constraints, examples, hidden testcases, and reference solutions.
* **Admin Dashboard APIs:** Powerful CRUD endpoints strictly guarded for administrators to build the platform's question bank.

### ⚙️ Code Execution Engine (Judge0)

* **Open-Source Powerhouse:** Powered by **Judge0**, a robust, open-source online code execution system.
* **Real-Time Code Evaluation:** Users submit code that gets routed securely to the Judge0 execution environment for compilation and execution.
* **Automated Grading:** Compares output with expected answers, capturing `stdout`, `stderr`, memory usage, compilation status, and execution time.
* **Submission History:** Persistent tracking of user attempts, test case results, and problem resolution status.

### 📁 Playlists & Curation

* Users can create, update, and delete **Problem Playlists**.
* Bookmark and organize coding problems for structured learning paths.

### 🛠 Architecture & Dev Experience

* **Code Quality & Formatting:** Automated linting and formatting maintained via **ESLint** and **Prettier**.
* **Git Hooks:** Enforced pre-commit checks and formatting using **Husky** alongside **lint-staged**.
* **Validation:** Strict, type-safe request parsing using **Zod** schema validation.
* **Centralized Error Handling:** Consistent API error responses avoiding unhandled exceptions.
* **Logging:** Advanced request and error logging powered by **Winston** and **Morgan**.
* **Media Uploads:** Seamless image uploads stored safely via **Cloudinary**.
* **API Documentation:** Fully documented with **Swagger UI**.

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

Ensure you have the following installed:

* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**
* **PostgreSQL** database
* **Judge0** (self-hosted or cloud API)
* **Cloudinary** account

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

3. **Configure environment variables:**

```bash
cp env.sample .env
```

Edit `.env` and provide your database, JWT, SMTP, Judge0, Cloudinary, and frontend configuration.

4. **Initialize the database:**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start the development server:**

```bash
npm run dev
```

The backend will be available at:

```text
http://localhost:4000
```

---

## 🔗 Connecting the Frontend

The DevArena frontend communicates with this backend through the REST API.

### Frontend Repository

Clone the frontend repository separately:

```bash
git clone https://github.com/vishalrathore8oct/codearena-client.git
cd codearena-client
npm install
```

### Backend Configuration

The backend must allow requests from the frontend development server.

In the backend `.env` file:

```env
PORT=4000
NODE_ENV=development

CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
APP_BASE_URL=http://localhost:4000
```

### Frontend Configuration

In the frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

The frontend Axios/API client uses this value as the base URL for backend requests.

Therefore, the local development setup is:

```text
┌──────────────────────────────┐
│     DevArena Frontend        │
│     React + Vite             │
│                              │
│ http://localhost:5173        │
└──────────────┬───────────────┘
               │
               │ REST API
               │ /api/v1/*
               ▼
┌──────────────────────────────┐
│      DevArena Backend        │
│      Node + Express          │
│                              │
│ http://localhost:4000        │
└──────────────┬───────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   PostgreSQL       Judge0
```

### Start Both Applications

Open two terminal windows.

**Terminal 1 — Backend:**

```bash
cd codearena-server
npm install
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd codearena-client
npm install
npm run dev
```

Then open the frontend:

```text
http://localhost:5173
```

The frontend will communicate with the backend through:

```text
http://localhost:4000/api/v1
```

### 🔐 Authentication & Cookies

The frontend uses Axios to communicate with the backend and supports the JWT authentication flow implemented by the server.

For local development, make sure:

* The frontend origin is included in `CORS_ORIGINS`.
* The frontend API base URL points to the backend.
* Backend authentication cookies are configured correctly for the development environment.
* Both applications are running on their expected ports.

If the frontend receives CORS or authentication errors, verify the frontend URL and backend CORS configuration first.

---

## ⚙️ Environment Variables

Your backend `.env` file should look like this:

```env
# Application Settings
PORT=4000
NODE_ENV=development

# Frontend / CORS
CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
APP_BASE_URL=http://localhost:4000

# Database
DATABASE_URL=your_database_url

# Authentication
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRES_IN=14d

# Nodemailer / SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Code Execution Engine
JUDGE0_API_URL=http://localhost:2358
```

> **Note:** `JUDGE0_API_URL` should point to the Judge0 API server itself. The `/docs` URL is for documentation and should not normally be used as the API base URL.

---

## 📜 API Documentation

Once the backend is running, you can explore and test the available API endpoints through Swagger UI:

```text
http://localhost:4000/api-docs
```

The frontend consumes the API endpoints under:

```text
http://localhost:4000/api/v1
```

---

## 📂 Project Structure

```text
server/
├── prisma/
│   ├── schema.prisma       # Prisma models
│   └── migrations/         # Database migrations
├── src/
│   ├── config/             # Environment & app configuration
│   ├── controllers/        # Route logic & request handling
│   ├── db/                 # Database connection utilities
│   ├── logger/             # Winston logger configuration
│   ├── middlewares/        # Auth, validation, upload, error handling
│   ├── routes/             # Express API route definitions
│   ├── services/           # External service integrations
│   ├── types/              # Global TypeScript types
│   ├── utils/              # Helpers and utilities
│   ├── validations/        # Zod validation schemas
│   ├── app.ts              # Express application setup
│   └── main.ts             # Server entry point
├── package.json
└── env.sample
```

---

## 🔧 Scripts

| Task           | Command          | Description                                      |
| :------------- | :--------------- | :----------------------------------------------- |
| **Start Dev**  | `npm run dev`    | Starts server with `tsx watch` for hot-reloading |
| **Build**      | `npm run build`  | Compiles TypeScript into JavaScript              |
| **Start Prod** | `npm start`      | Runs the compiled application                    |
| **Lint**       | `npm run lint`   | Lints the codebase using ESLint                  |
| **Format**     | `npm run format` | Formats files using Prettier                     |

---

## 🔄 Development Workflow

For local development, both repositories should be running:

```text
codearena-client
       │
       │ HTTP / REST API
       ▼
codearena-server
       │
       ├── PostgreSQL
       │
       └── Judge0
```

Recommended startup order:

1. Start PostgreSQL.
2. Start Judge0.
3. Start the backend.
4. Start the frontend.
5. Open `http://localhost:5173`.

---

## 👤 Author

**Vishal Rathore**

* GitHub: [@vishalrathore8oct](https://github.com/vishalrathore8oct)
* X / Twitter: [@vishalrathore66](https://x.com/vishalrathore66)
* LinkedIn: [Vishal Rathore](https://www.linkedin.com/in/vishalrathore8oct/)
* Blog: [vishalrathore.hashnode.dev](https://vishalrathore.hashnode.dev/)

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome!

Feel free to check the [issues page](https://github.com/vishalrathore8oct/codearena-server/issues) or submit a pull request.

---

## ⭐ Show Your Support

If this project helped you or you learned something new, please give it a ⭐️ on GitHub!

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
