# 📘 JARVIS – Student Assistant Platform

JARVIS is a web-based student assistant platform built with **Django**, **HTML**, **CSS**, and **JavaScript**.  
Its goal is to help students manage learning resources and improve their study workflow through a clean UI and AI assistance.

---

## 🚀 Features

### 🔐 User Accounts
- Student & Admin roles  
- Secure registration and login  
- Profile section  
- Password change  

### 📚 Digital Library
- Browse active books  
- View book details  
- Add/remove favourite books  
- View favourite list  

### 🤖 AI Assistant
- Chat-based study support  
- Helps with explanations and guidance  
- Uses secure private API tokens (never exposed)

### 🖥️ Student Dashboard (SPA-like)
- Main UI: `jarwis.html`  
- JavaScript switches visible sections  
- No full-page reloads  

### 🛠️ Admin Tools
- Manage users (view/delete/deactivate)  
- Manage books (create/edit/delete)

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Backend | **Django (Python)** |
| Frontend | HTML, CSS, JavaScript |
| Database | SQLite (dev) |
| Architecture | MVC-style (mapped from Django MVT) |
| Security | HTTPS, secure cookies, private server tokens |

---

# 🏗️ Backend Architecture

Django uses **MVT (Model–View–Template)**,  
but the project is documented in **MVC terms** as well for clarity.

---

## 1️⃣ Models (M)

### User  
(Extends Django’s built-in `User` via a custom user model or profile)  
- `id` *(Primary Key)*  
- `username`  
- `email`  
- `password` *(hashed, managed by Django)*  
- `role` (**student / admin**)  
- `is_active`  
- `date_joined`  

### Book  
- `id` *(Primary Key)*  
- `title`  
- `author`  
- `category`  
- `description`  
- `file_url` *(link to PDF / external resource)*  
- `is_active` *(controls visibility in the library)*  

### FavoriteBook  
- `id` *(Primary Key)*  
- `user` *(FK → User)*  
- `book` *(FK → Book)*  
- `added_at`  

### Task (To-Do / Planner)  
- `id` *(Primary Key)*  
- `user` *(FK → User)*  
- `title`  
- `description` *(optional)*  
- `status` **(pending / in_progress / done)**  
- `priority` **(low / normal / high)**  
- `due_datetime` *(optional)*  
- `created_at`  
- `updated_at`  

### Event (Schedule / Calendar)  
- `id` *(Primary Key)*  
- `user` *(FK → User)*  
- `title`  
- `description` *(optional)*  
- `start_datetime`  
- `end_datetime` *(optional)*  
- `location` *(optional)*  
- `is_all_day` *(boolean)*  
- `repeat` *(optional: **none / daily / weekly / monthly**)*  

### AIConversation  
- `id` *(Primary Key)*  
- `user` *(FK → User)*  
- `title` *(optional, e.g. “Algebra revision”)*  
- `created_at`  
- `updated_at`  

### AIMessage  
- `id` *(Primary Key)*  
- `conversation` *(FK → AIConversation)*  
- `sender` **(user / assistant)**  
- `content` *(message text)*  
- `created_at`  


---

## 2️⃣ Controllers (C) – Django Views / APIs

### Authentication & Profile  
- `RegisterView` – create new student/admin accounts  
- `LoginView` – user login  
- `LogoutView` – user logout  
- `ChangePasswordView` – password change for logged-in users  
- `ProfileView` – view current user profile  
- `ProfileUpdateView` – update profile details  

### Library  
- `BookListView` – list of active books (HTML / JSON)  
- `BookDetailView` – view single book details  
- `FavoriteBookToggleView` – add/remove book from favourites  
- `FavoriteListView` – list of user’s favourite books  

### Tasks (To-Do List)  
- `TaskListView` – list tasks for current user  
- `TaskCreateView` – create a new task  
- `TaskUpdateView` – edit task (title, status, priority)  
- `TaskDeleteView` – delete task  
- `TaskListAPI` – JSON API endpoint for tasks (used by JS in dashboard)  

### Schedule (Events / Calendar)  
- `EventListView` – list events for current user  
- `EventCreateView` – create new event  
- `EventUpdateView` – edit event (time, description, repeat)  
- `EventDeleteView` – delete event  
- `EventListAPI` – JSON API endpoint for calendar events  

### AI Assistant  
- `AIChatPageView` – renders AI chat section inside `jarwis.html`  
- `AIChatAPIView` – REST endpoint: receives a prompt and returns AI response (JSON)  
- `AIConversationListView` – list previous AI conversations (optional)  
- `AIConversationDetailView` – load a specific conversation history (optional)  

### Dashboard / SPA Wrapper  
- `DashboardView` – renders `jarwis.html` for logged-in students  
  - Provides initial data (user info, some tasks/events/books)  
  - Frontend JavaScript calls REST APIs for live updates  

### Admin  
- `AdminDashboardView` – admin overview  
- `AdminUserListView` – list all users  
- `AdminUserDetailView` – inspect a user (profile, activity)  
- `AdminUserDeactivateView` / `AdminUserDeleteView` – deactivate or delete accounts  
- `AdminBookCreateView` – add a new book to the library  
- `AdminBookUpdateView` – edit existing book  
- `AdminBookDeleteView` – delete/deactivate book  
- `AdminTaskListView` – optional: view tasks across users  
- `AdminEventListView` – optional: view events across users  


---

## 3️⃣ Views (V) – Templates

### Public Templates  
- `login.html` – login form  
- `register.html` – registration form  

### Student Dashboard (SPA-like)  
- `jarwis.html` – main student interface  
  - Header / navbar  
  - Multiple UI sections inside the same page (shown/hidden by JavaScript):  
    - **Library section** – book list, book details, favourites  
    - **Tasks section** – to-do list with priorities and status  
    - **Schedule section** – calendar / upcoming events view  
    - **AI assistant section** – chat UI, conversation history  
    - **Profile section** – user info, settings, password change  

JavaScript switches which section is visible without full-page reload and communicates with the Django REST API endpoints.

### Admin Templates  
- `admin.html` – main admin dashboard shell  
- `admin/books.html` – manage books (list, search, create/edit/delete)  
- `admin/users.html` – manage users (list, detail, deactivate/delete)  
- `admin/book_form.html` – create/update book form  
- `admin/tasks.html` – optional admin tasks overview  
- `admin/events.html` – optional admin events overview  

All templates typically extend a common `jarwis.html` for shared layout (header, footer, styles).

---

# 🔐 Primary Keys

All Django models use integer **Primary Keys (PK)** by default.  
This ensures:
- fast indexing  
- clean relational structure  
- stable foreign key mapping  

---

# 🌐 Communication Protocol

The platform uses **HTTPS** for all communication:

- Encrypted client–server connections  
- Secure authentication  
- Protected API token usage  
- REST-style endpoints  

---

# 🔌 API – How It Works

### API Flow
1. JavaScript sends request → Django View  
2. View processes/validates data  
3. Optional: calls AI external API  
4. View returns JSON  
5. JavaScript updates section of `jarwis.html`

### API Types
- `/auth/*`  
- `/books/*`  
- `/favorites/*`  
- `/ai/chat/`  

Dashboard behaves like a **single-page application**.

---

# 🖥️ Server Management

### Development
- Django `runserver`
- SQLite database

### Production (recommended)
- Gunicorn / uWSGI  
- Nginx reverse proxy  
- PostgreSQL  
- Environment variables for secrets  
- HTTPS enforced

---

# 🔑 Token System

### Private Tokens (server-side only)
- stored in `.env`
- used for AI API calls
- never exposed to templates or JS

### User Session Tokens
- generated by Django  
- stored in **HTTP-only cookies**  
- safe authentication mechanism  

---

# 🧩 MVC & MVT Architecture

### MVC (conceptual)
- **Model** → Django Models  
- **View** → Django Views (logic)  
- **Controller** → JavaScript section switching  

### MVT (Django-native)
- **Model** → Data structure  
- **View** → Request handler  
- **Template** → HTML rendering  

---

# 📁 Project Structure


```text
jarvis/
├── manage.py
├── requirements.txt
│
├── jarvis/ # Project settings
├── accounts/ # Auth & profile
├── library/ # Books & favourites logic
├── ai/ # AI assistant logic (optional)
│
├── templates/
│ ├── login.html
│ ├── register.html
│ ├── jarwis.html
│ ├── admin.html
│ └── base.html
│
└── static/ # CSS / JS / images



```
---

# 📌 License
MIT or your chosen license.

---

# 🙌 Acknowledgements
- Django Framework  
- Voicflow API  
- Bootstrap / Frontend libraries  
- UFAR – Student research project


