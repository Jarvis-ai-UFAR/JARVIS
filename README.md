# JARVIS – Student Assistant Platform

JARVIS is a web-based student assistant platform built with **Django**, **HTML**, **CSS** and **JavaScript**.  
The goal is to create a tool that every student can use daily to manage learning resources and their study workflow.

Currently, JARVIS focuses on:

- Secure user accounts (students and admins)
- A digital library of books
- Personalisation via favourite books
- A clean, student-friendly interface

---

## 1. Features

- User registration and login
- Profile page with basic account info
- Password change for logged-in users
- Role-based access (student / admin)
- Digital library of books
- Mark / unmark books as favourites
- Admin pages for managing users and books

(Future features: full student dashboard with to-do list, schedule, Pomodoro, and AI assistant.)

---

## 2. Tech Stack

- **Backend:** Django (Python)
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite (development), can be upgraded to PostgreSQL in production
- **Architecture pattern:** MVC-style (Django MVT mapped to MVC)

---

## 3. Backend Architecture (MVC Overview)

Although Django uses **MVT (Model–View–Template)**, we describe the architecture in **MVC terms** for clarity.

### 3.1 Models (M)

- **User**
  - `id`
  - `username`
  - `email`
  - `password` (hashed)
  - `role` – `"student"` or `"admin"`

- **Book**
  - `id`
  - `title`
  - `author`
  - `category`
  - `description`
  - `file_url` / `file_path`
  - `is_active`

- **FavoriteBook**
  - `id`
  - `user` (FK → User)
  - `book` (FK → Book)
  - `added_at` (timestamp)

> Note: **Admin is not a separate model**. Admins are Users with `role = "admin"`.

---

### 3.2 Controllers (C) – Django Views

#### Auth / Account Controllers

- `RegisterView`
  - Handles user sign up and validation.

- `LoginView`
  - Authenticates user and starts session.

- `LogoutView`
  - Logs out the current user and clears the session.

- `ChangePasswordView`
  - Allows a logged-in user to change their password.

- `ProfileView`
  - Displays and updates basic user profile data.

#### Library / Book Controllers

- `BookListView`
  - Lists all available books for students.

- `BookDetailView`
  - Shows details of a single book.

- `FavoriteBookToggleView`
  - Adds or removes a book from the current user’s favourites.

- `FavoriteListView`
  - Shows all favourite books of the current user.

#### Admin Controllers

- `AdminDashboardView`
  - Main admin homepage.

- `AdminUserListView`
  - Lists all users, with options to view or manage them.

- `AdminUserDeleteView`
  - Deletes or deactivates a user (admin-only).

- `AdminBookCreateView`
  - Creates a new book entry.

- `AdminBookUpdateView`
  - Edits an existing book.

- `AdminBookDeleteView`
  - Deletes a book from the library.

---

### 3.3 Views (V) – Templates

**User-facing templates**

- `base.html`
  - Base layout (navbar, footer, shared structure).

- `register.html`
  - Registration form.

- `login.html`
  - Login form.

- `profile.html`
  - User profile information and password change link/section.

- `books.html`
  - Main digital library page showing list of books.

- `book_detail.html`
  - Detailed page for a single book.

- `favorites.html`
  - List of the current user’s favourite books.

**Admin templates**

- `admin/dashboard.html`
  - Overview page for admin actions.

- `admin/users.html`
  - User management page (list, delete, change role).

- `admin/books.html`
  - Manage books (list view).

- `admin/book_form.html`
  - Form used for creating or updating books.

---

## 4. User Roles

### Student

- Register and log in
- View and update their profile
- Browse the book library
- Mark / unmark favourite books
- View their list of favourites

### Admin

- All student permissions
- Access the admin dashboard
- Manage users (view, delete/deactivate, change role)
- Manage books (create, edit, delete)

---

## 5. Project Structure (High-Level)

```text
jarvis/
├─ manage.py
├─ jarvis/               # Django project settings
├─ accounts/             # Auth & profile (controllers + models)
├─ library/              # Book and favourites logic
├─ templates/
│  ├─ base.html
│  ├─ register.html
│  ├─ login.html
│  ├─ profile.html
│  ├─ books.html
│  ├─ book_detail.html
│  ├─ favorites.html
│  └─ admin/
│     ├─ dashboard.html
│     ├─ users.html
│     ├─ books.html
│     └─ book_form.html
├─ static/               # CSS / JS / images
└─ requirements.txt
