# 📘 JARVIS – Student Assistant Platform

JARVIS is a web-based student assistant platform built with **Django**, **HTML**, **CSS**, and **JavaScript**.  
Its goal is to help students manage learning resources and improve their study workflow through a clean UI and AI assistance.

Link: https://jarvis-ai-ufar.github.io/JARVIS/

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
JARVIS/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example                      # example env vars (never commit real .env)
├── requirements.txt
├── manage.py
│
├── config/                           # Django project config (settings + root urls)
│   ├── __init__.py
│   ├── settings.py                   # INSTALLED_APPS, DB, i18n, security, static/media
│   ├── urls.py                       # includes app urls + set_language + admin
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/                             # all Django apps live here
│   ├── core/                         # landing page + shared pages/utilities
│   │   ├── __init__.py
│   │   ├── urls.py                   # /  (landing), /about, /privacy (optional)
│   │   ├── views.py
│   │   ├── templates/core/
│   │   │   ├── landing.html
│   │   │   ├── base.html             # main layout (navbar/footer), extended everywhere
│   │   │   └── components/           # reusable partials (navbar, footer, toasts)
│   │   │       ├── navbar.html
│   │   │       └── footer.html
│   │   └── static/core/
│   │       ├── css/
│   │       ├── js/
│   │       └── img/
│   │
│   ├── accounts/                     # auth + roles + profile + language preference
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                 # CustomUser or Profile model, role field
│   │   ├── forms.py                  # RegisterForm, LoginForm, ProfileUpdateForm
│   │   ├── services.py               # helpers (role checks, email utils)
│   │   ├── selectors.py              # query helpers (clean DB access layer)
│   │   ├── urls.py                   # /login /register /logout /profile /password
│   │   ├── views.py
│   │   ├── tests.py
│   │   ├── migrations/
│   │   └── templates/accounts/
│   │       ├── login.html
│   │       ├── register.html
│   │       ├── profile.html          # optional (or dashboard section)
│   │       └── password_change.html
│   │
│   ├── dashboard/                    # the real app entry point (protected)
│   │   ├── __init__.py
│   │   ├── urls.py                   # /dashboard/
│   │   ├── views.py                  # DashboardView (login required)
│   │   ├── tests.py
│   │   └── templates/dashboard/
│   │       └── jarwis.html           # SPA-like: sections shown/hidden via JS
│   │
│   ├── library/                      # books/resources + favourites
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                 # Resource/Book, Favourite model
│   │   ├── selectors.py              # list/filter resources, favourites
│   │   ├── services.py               # favourite toggle, permissions checks
│   │   ├── urls.py                   # /books/ (html) + /api/books/ (json)
│   │   ├── views.py
│   │   ├── tests.py
│   │   ├── migrations/
│   │   └── templates/library/
│   │       ├── book_list.html        # optional (if you also keep normal pages)
│   │       └── book_detail.html
│   │
│   ├── planner/                      # tasks + schedule/events + reminders
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                 # Task, Event
│   │   ├── selectors.py              # upcoming events, overdue tasks
│   │   ├── services.py               # repeat rules, priority logic, validations
│   │   ├── urls.py                   # /api/tasks/, /api/events/
│   │   ├── views.py
│   │   ├── tests.py
│   │   └── migrations/
│   │
│   ├── ai/                           # AI assistant (server-side tokens)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py                 # AIConversation, AIMessage (optional)
│   │   ├── services.py               # provider wrapper (Voiceflow/OpenAI later)
│   │   ├── safety.py                 # red flags, rate limit helpers, logging
│   │   ├── urls.py                   # /api/ai/chat/, /api/ai/history/
│   │   ├── views.py
│   │   └── tests.py
│   │
│   └── adminpanel/                   # your custom admin UI (not Django admin)
│       ├── __init__.py
│       ├── urls.py                   # /admin-panel/
│       ├── views.py                  # manage users/resources
│       ├── permissions.py            # admin-only decorators/mixins
│       ├── templates/adminpanel/
│       │   ├── admin.html
│       │   ├── users.html
│       │   ├── books.html
│       │   └── book_form.html
│       └── tests.py
│
├── api/                              # optional: keep all JSON endpoints grouped
│   ├── __init__.py
│   ├── urls.py                       # /api/ root router
│   └── responses.py                  # standard JSON response format helpers
│
├── static/                           # global static (if not app-scoped)
│   ├── css/
│   │   ├── base.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── dashboard.js              # section switching, fetch calls to /api/*
│   │   ├── auth.js
│   │   └── i18n.js                   # optional client helpers (if needed)
│   └── img/
│
├── templates/                        # optional global shared templates
│   └── shared/
│       ├── base.html
│       └── components/
│           ├── navbar.html
│           └── messages.html         # Django flash messages/toasts
│
├── locale/                           # translations (Armenian/Russian/English/French)
│   ├── hy/LC_MESSAGES/django.po
│   ├── ru/LC_MESSAGES/django.po
│   ├── en/LC_MESSAGES/django.po
│   └── fr/LC_MESSAGES/django.po
│
├── media/                            # uploaded PDFs/images (prod), ignored in git
│
├── scripts/                          # small utilities (optional)
│   ├── seed_demo_data.py             # add demo books/tasks
│   └── create_admin.py               # quick admin creation helper
│
├── docs/                             # diagrams + screenshots for reports
│   ├── architecture/
│   ├── ui/
│   └── ada_checklist.md
│
└── deploy/                           # deployment configs (when you go production)
    ├── nginx/
    │   └── jarvis.conf
    ├── systemd/
    │   └── gunicorn.service
    └── docker/                       # optional if you containerize later
        ├── Dockerfile
        └── docker-compose.yml




```
---

# 📌 License
MIT or your chosen license.

---

# 🙌 Acknowledgements
- Django Framework  
- Django REST Framework  
- Voiceflow – conversational flow prototyping  
- OpenAI / ChatGPT – AI assistance for design and development  
- Bootstrap and other frontend CSS/JS libraries  
- Font Awesome and icon libraries used in the UI  
- MDN Web Docs and official Django documentation  
- Git and GitHub – version control and collaboration  
- GitHub Pages – hosting of the current frontend prototype  
- UFAR – Student research and development support  



