# Vital Sync Backend

Backend for HTTP requests of the **Vital Sync** project (Remote Vital Signs Monitoring).
Built with **Node.js** and **TypeScript**.

---

## 🚀 Features

* **User Authentication:** Secure login system for platform access.
* **Database with Prisma:** Uses **Prisma ORM** with **SQLite** for simple and safe database interaction.
* **MVC Structure:** Clean and maintainable code following *Model-View-Controller* pattern.

---

## 📋 Requirements

* Node.js **18+**
* npm **9+** (or **yarn/pnpm**)
* TypeScript

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/vital-sync-backend.git
   cd vital-sync-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup database**

   * Copy `.env.example` to `.env`
   * Defaults to **SQLite**

   Run migrations:

   ```bash
   npx prisma migrate dev
   ```

---

## 📜 Available Scripts

* **Development**

  ```bash
  npm run dev
  ```

  Runs the server with hot reload (`ts-node`).

* **Build**

  ```bash
  npm run build
  ```

  Compiles TypeScript into JavaScript (`dist/`).

* **Production**

  ```bash
  npm start
  ```

  Runs the compiled build.

* **Create a new user**

  ```bash
  npm run user:create
  ```

  Executes script to create a user in the database.

---

## 🗄️ Database

* Database: **SQLite**
* ORM: **Prisma**

📂 Structure:

* `prisma/schema.prisma` → Schema definition
* `prisma/migrations/` → Versioned migrations

Generate a new migration:

```bash
npx prisma migrate dev --name "migration-name"
```

---

## 🔑 Authentication

* Based on **JWT**.
* Protected routes require a valid **access token**.

---

## ⚡ Configuration

* Configurations (port, keys, etc.) are defined via **environment variables** (`.env`).

---

## 🖥️ Running on a New Machine

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd VitalSync-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment**

   * Copy `.env.example` → `.env`
   * Adjust variables as needed

4. **Generate Prisma Client & run migrations**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **(Optional) Create a test user**

   ```bash
   npx ts-node src/scripts/createTestUser.ts
   ```

6. **Start the server in development mode**

   ```bash
   npm run dev
   ```

7. **Access the API**

   * API: [http://localhost:3001](http://localhost:3001)
   * Swagger: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
