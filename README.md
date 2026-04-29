# Welcome to CodeArena Backend 👋

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

**CodeArena Backend** is a scalable backend application for a competitive programming platform. It exposes RESTful APIs for authentication, problem management, and administration of coding content while using modern tooling such as **Express**, **Prisma**, and **PostgreSQL**.

### ✨ Key Highlights

- **User Authentication:** JWT-based login, refresh token support, email verification, and password reset.
- **Problem Management:** Create, read, update, and delete coding problems with tags, examples, constraints, and editorial data.
- **Swagger Documentation:** Built-in API documentation at `/api-docs`.
- **Health Check:** Ready-to-use endpoint for uptime monitoring.
- **Prisma ORM:** Strong type-safe database access.
- **Modular Architecture:** Clear separation between controllers, routes, middlewares, services, and utils.

---

## 🛠 Features

- 🔐 Secure authentication and authorization
- 🧠 CRUD operations for coding problems
- 📦 File and request validation via middleware
- 📧 Email workflows for verification and password reset
- ⚠️ Centralized error handling
- 🌐 CORS support with configurable origins
- 📊 Swagger/OpenAPI documentation

---

## Technologies Used

- **Node.js**
- **Express.js**
- **Prisma**
- **PostgreSQL**
- **TypeScript**
- **Swagger**
- **bcrypt**
- **jsonwebtoken**
- **nodemailer**
- **cloudinary**
- **winston**
- **morgan**

---

## Database Schema

The backend uses Prisma schema models for `User` and `Problem`, including:

- `User` with authentication fields, profile data, role, refresh tokens, email verification, and password reset flow.
- `Problem` with title, description, difficulty, tags, hints, constraints, examples, testcases, code snippets, and reference solutions.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/vishalrathore8oct/codearena-server.git
cd codearena-server

# Install dependencies
npm install

# Create your .env file and configure environment variables
cp env.sample .env

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `env.sample` and configure values for your environment:

```env
PORT=8000
NODE_ENV=development
CORS_ORIGINS=*
APP_BASE_URL=http://localhost:8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRES_IN=14d
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USERNAME=<smtp_user>
SMTP_PASSWORD=<smtp_password>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
```

---

## 📜 API Documentation (Swagger UI)

Once the server is running, explore the API via Swagger:

```bash
http://localhost:4000/api-docs
```

---

## 📂 Project Structure

```
server/
├── src/
│   ├── app.ts
│   ├── main.ts
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controllers.ts
│   │   └── problem.controllers.ts
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validations/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── generated/
│   └── prisma/
├── env.sample
├── package.json
└── README.md
```

---

## 🔧 Scripts

| Task                     | Command                  |
| ------------------------ | ------------------------ |
| Start development server | `npm run dev`            |
| Build production code    | `npm run build`          |
| Start production server  | `npm start`              |
| Run lint                 | `npm run lint`           |
| Format code              | `npm run format`         |
| Run Prisma migrations    | `npx prisma migrate dev` |
| Generate Prisma client   | `npx prisma generate`    |

---

## 👤 Author

**Vishal Rathore**

- GitHub: https://github.com/vishalrathore8oct
- X: https://x.com/vishalrathore66
- LinkedIn: https://www.linkedin.com/in/vishalrathore8oct/
- Blog: https://vishalrathore.hashnode.dev/

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## ⭐ Show Your Support

If this project helped you, give it a ⭐️ on GitHub!

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
