# E‑TODO – Task Manager
## Tech Stack

- Frontend
  - Next.js (App Router, React, TypeScript)
  - Tailwind CSS
  - Lucide icons

- Backend
  - Node.js + Express
  - JWT authentication
  - REST API for users and todos

- Database
  - MySQL
  - Tables: `users`, `todo`

- Infrastructure
  - Docker & Docker Compose
  - phpMyAdmin to inspect the database

---

## Setup and Run

### 1. Prerequisites

- Docker and Docker Compose installed
- Free ports, for example:
  - Frontend: `8080` (mapped to Next.js `3000` in the container)
  - Backend: `3000`
  - MySQL: `3306`
  - phpMyAdmin: `8081`

### 2. Start the stack

From the project root:
    ```
    docker compose up --build
    ```
This will:

- Build and start the frontend container (Next.js)
- Build and start the backend container (Express API)
- Start MySQL and apply the SQL schema
- Start phpMyAdmin

### 3. Services URLs

- Web app (frontend): `http://localhost:8080`
- API (backend): `http://localhost:3000`
- phpMyAdmin: `http://localhost:8081`



## Using the Web App

### 1. Register

1. Go to `http://localhost:8080/register`.
2. Fill the registration form (username, first name, last name, email, password, phone).
3. Submit:
   - A new row is created in the `users` table.
   - A JWT token is returned and stored in `localStorage`.

### 2. Login

1. Go to `http://localhost:8080/login`.
2. Enter your email and password.
3. On success:
   - The token is saved in `localStorage`.
   - The frontend calls `/user/me` to load the current user.
   - You are redirected to the dashboard (`/dashboard`).

Protected routes (Dashboard, Profile) check authentication and redirect to `/login` if there is no valid token.

### 3. Dashboard – Manage Todos

URL: `http://localhost:8080/dashboard`

Features:

- Create a task:
  - Enter title and description.
  - Choose a priority: `low`, `medium`, or `high`.
  - Click “Add Task”.
- Update a task:
  - Click the pencil icon (“Edit”).
  - Change title, description, and/or priority.
  - Save to update the task in the database.
- Toggle completion:
  - Click the circle/check icon to mark a task as done or not done.
- Delete a task:
  - Click the trash icon to remove the task.
- Counters:
  - The dashboard shows total tasks, active tasks, and completed tasks.

### 4. Profile Page

URL: `http://localhost:8080/profile`

Here you can view and update your user information:

- Username  
- First name  
- Last name  
- Email  
- Phone  

Click on “Save changes” to persist the updates in the `users` table.  
If the token is invalid or the user no longer exists, the app clears the token and redirects to `/login`.

### 5. Logout

- From the dashboard header, click “Logout”.
- The JWT token is removed from `localStorage`.
- You are redirected to the login page.
- Protected pages are no longer accessible until you log in again.

---

## Development Notes

- Frontend code is baked into the Docker image (no volume for the source), so:
  - Code changes require rebuilding the frontend image:
    ```
    docker compose up --build
    ```
- Backend and database configuration (ports, credentials, etc.) can be adjusted in `docker-compose.yml` and environment files.
- To stop the stack:
    ```
    docker compose down
    ```
