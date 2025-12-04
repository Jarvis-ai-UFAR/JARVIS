# JARVIS – Student Assistant Platform

JARVIS is a web-based student assistant platform built with **Django**, **HTML**, **CSS** and **JavaScript**.  
The goal is to create a tool that every student can use daily to manage learning resources and their study workflow.

Currently, JARVIS focuses on:

- Secure user accounts (students and admins)
- A digital library of books
- Personalisation via favourite books
- **AI assistant features for students (study help and guidance)**
- A clean, student-friendly interface

The main authenticated interface is a **single-page dashboard** (`jarwis.html`):  
when the user clicks items in the navbar, **only the visible section changes** via JavaScript  
(the browser does not load a new HTML file).

---

## 1. Features

- User registration and login
- Profile page / section with basic account info
- Password change for logged-in users
- Role-based access (student / admin)
- Digital library of books
- Mark / unmark books as favourites
- **AI assistant for students (chat-based help for studying and navigation)**
- Single-page dashboard where navigation only switches sections
- Admin pages for managing users and books

(Future improvements: full student dashboard with to-do list, schedule, advanced Pomodoro, and smarter AI assistant.)

---

## 2. Tech Stack

- **Backend:** Django (Python)
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite (development), can be upgraded to PostgreSQL in production
- **Architecture pattern:** MVC-style (Django MVT mapped to MVC)
- **Frontend navigation:** single-page dashboard (`jarwis.html`) with section switching via JS

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
  - Displays and updates basic user profile data
  - In the UI, profile can be a separate page or a section inside `jarwis.html`.

#### Library / Book Controllers

- `BookListView`
  - Provides data for the books section in the dashboard.

- `BookDetailView`
  - Shows details of a single book (or returns data for a detail view/modal).

- `FavoriteBookToggleView`
  - Adds or removes a book from the current user’s favourites.

- `FavoriteListView`
  - Shows all favourite books of the current user.

#### Admin Controllers

- `AdminDashboardView`
  - Main admin homepage (served by `admin.html`).

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

**Public / Auth templates**

- `login.html`
  - Login form page.

- `register.html`
  - Registration form page.

- `base.html`
  - Base layout that other templates can extend (navbar, footer, etc., if used).

**Main student dashboard (single-page)**

- `jarwis.html`
  - Main authenticated dashboard.
  - Contains multiple **sections**: library, favourites, AI assistant, etc.
  - The navbar switches visible sections using JavaScript (single-page behaviour, not full-page reloads).

**Optional / extra templates**

- `profile.html` (if implemented as a separate page instead of a section)
  - User profile information and password change area.

**Admin templates**

- `admin.html`
  - Main admin interface layout (navbar + sections or links).

- Possible sub-templates:
  - `admin/dashboard.html`
  - `admin/users.html`
  - `admin/books.html`
  - `admin/book_form.html`

(Depending on implementation, admin can also use a single-page pattern similar to `jarwis.html`.)

---

## 4. User Roles

### Student

- Register and log in
- View and update their profile
- Access the single-page dashboard (`jarwis.html`)
- Browse the book library
- Mark / unmark favourite books
- View their list of favourites
- **Use the AI assistant for study support**

### Admin

- All student permissions
- Access the admin interface (`admin.html`)
- Manage users (view, delete/deactivate, change role)
- Manage books (create, edit, delete)

---

## 5. Project Structure (High-Level)

```text
jarvis/
├─ manage.py
├─ jarvis/                # Django project settings
├─ accounts/              # Auth & profile (controllers + models)
├─ library/               # Book and favourites logic
├─ templates/
│  ├─ base.html
│  ├─ login.html
│  ├─ register.html
│  ├─ jarwis.html         # main single-page student dashboard
│  ├─ profile.html        # (optional separate profile page)
│  └─ admin.html          # main admin interface (with sections or sub-templates)
├─ static/                # CSS / JS / images
└─ requirements.txt
