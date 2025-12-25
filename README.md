# File Uploader — Node.js + Express + PostgreSQL

A full-stack Express application that allows users to:

- Create an account and log in (Passport.js + bcrypt)

- Upload files

- View uploaded files

- Download or delete their own files

- Persist everything in PostgreSQL (local or Neon-hosted)

UI is styled using EJS templates with UIkit and custom CSS.

## Features

- 🔐 User authentication with sessions (Passport Local Strategy)

- 🔑 Password hashing using bcryptjs

- 📂 File uploads stored in PostgreSQL as binary data (BYTEA)

- 📥 Download or inline-preview files

- 🗑️ Delete files securely (user-scoped)

- 🎨 EJS + UIkit for responsive UI

- 🌐 Ready for deployment (Neon + Koyeb or similar)

## Requirements

- Node.js (v18+ recommended)

- PostgreSQL (local or Neon Cloud)

- npm or yarn

## Environment Variables

Create a .env file in the project root:
```
PORT=3000

# Sessions
SESSION_SECRET=your_session_secret_here

# PostgreSQL / Neon
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME

# Optional overrides (usually not needed if DATABASE_URL is set)
DB_HOST=
DB_USER=
DB_NAME=
DB_PORT=
NODE_ENV=development
```

## Install & Run Locally
1. Install dependencies
```
npm install
```
2. Start PostgreSQL & create tables

Connect to your DB (psql or Neon SQL Editor), then run:
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mimetype TEXT,
  filedata BYTEA NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```
3. Start the server
```
npm start
```

Visit:
```
http://localhost:3000
```
## Key Libraries

- Express – routing & middleware

- Passport – authentication

- express-session – session handling

- bcryptjs – password hashing

- pg – PostgreSQL client

- multer – file uploads

- EJS – server-rendered views

- UIkit – prebuilt UI styling

## File Upload Flow

1. User logs in

2. Chooses a file

3. File is processed by multer

4. Saved in DB as BYTEA

5. User can:

    - click filename to view

    - download file

    - delete the file

All actions are scoped by user, meaning users cannot access each other’s data.