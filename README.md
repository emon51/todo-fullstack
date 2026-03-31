# Todo Fullstack Application

A full stack Todo application built with **Django REST Framework** (backend) and **React** (frontend), running fully in Docker.

---

## Project Structure

```
TODO_FULLSTACK/
├── backend/                        # Django REST API
│   ├── apps/
│   │   ├── todos/                  # Todos app (CRUD, filter, search)
│   │   └── users/                  # Auth app (register, login)
│   ├── config/                     # Project configuration
│   │   ├── settings.py             # Django settings
│   │   ├── urls.py                 # Root URL config
│   │   ├── exceptions.py           # Global error handler
│   │   └── pagination.py           # Custom pagination
│   ├── tests/                      # All backend tests
│   ├── secrets/                    # Docker secrets (not in git)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── API_DOCS.md
│
└── frontend/                       # React Application
    ├── public/
    ├── src/
    │   ├── api/                    # Axios instance and API functions
    │   │   ├── axiosInstance.js    # Base axios with JWT interceptors
    │   │   ├── authApi.js          # Auth API calls (login, register)
    │   │   └── todoApi.js          # Todo API calls (CRUD)
    │   ├── components/             # Reusable UI components
    │   │   ├── Modal.jsx           # Reusable modal dialog
    │   │   ├── Navbar.jsx          # Top navigation bar
    │   │   ├── TaskCard.jsx        # Single task card with actions
    │   │   └── TaskForm.jsx        # Create/edit task form
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state management
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Main task management page
    │   │   ├── Login.jsx           # Login page
    │   │   └── Register.jsx        # Register page
    │   ├── App.jsx                 # Routes and protected routes
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global styles
    ├── .env                        # Environment variables
    ├── .env.example                # Environment variables example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.12 | Programming language |
| Django 6.0 | Web framework |
| Django REST Framework | REST API |
| PostgreSQL 15 | Database |
| JWT (SimpleJWT) | Authentication |
| django-cors-headers | CORS handling |
| Docker & Docker Compose | Containerization |
| pytest | Testing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS v3 | Styling |
| Axios | HTTP client |
| React Router v7 | Client-side routing |
| PropTypes | Props validation |

---

## Features

### Authentication
- User registration with auto-login
- JWT-based login and logout
- Protected routes — redirects to login if not authenticated
- Token stored in localStorage
- Auto-logout on token expiry (401)
- Persistent login across page refreshes

### Task Management
- Create tasks with title and optional description
- View all tasks in a paginated list
- Edit task title, description and status
- Delete tasks with confirmation
- Toggle tasks between pending and completed
- Filter tasks by All / Pending / Completed tabs
- Search tasks by title
- Sort tasks by title or created date

### UX
- Loading spinners
- Error messages with dismiss button
- Empty state UI per tab
- Responsive design
- Accessible — semantic HTML, ARIA labels, keyboard support

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js v18+](https://nodejs.org/)
- [NVM](https://github.com/nvm-sh/nvm) (recommended)

---

## Quick Start

### Backend Setup

#### 1. Clone the repository
```bash
git clone https://github.com/emon51/todo-fullstack.git
cd todo_fullstack/backend
```

#### 2. Create secrets directory and files
```bash
mkdir secrets
echo "todo_db"                      > secrets/db_name.txt
echo "todo_user"                    > secrets/db_user.txt
echo "todo_password"                > secrets/db_password.txt
echo "your-secret-key-change-this"  > secrets/secret_key.txt
```

#### 3. Start the backend
```bash
docker compose up --build -d
```

Backend API is now running at `http://localhost:8000/api/v1/`

---

### Frontend Setup

#### 1. Navigate to frontend
```bash
cd todo-fullstack/frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment
```bash
cp .env.example .env
```

`.env` should contain:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

#### 4. Start the dev server
```bash
npm run dev
```

Frontend is now running at `http://localhost:5173`

---

## API Endpoints

### Auth Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/auth/register/` | No | Register a new user |
| POST | `/api/v1/auth/login/` | No | Login and get JWT tokens |

### Todo Endpoints
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/todos/` | Yes | List all your todos |
| POST | `/api/v1/todos/` | Yes | Create a new todo |
| GET | `/api/v1/todos/<id>/` | Yes | Get a single todo |
| PUT | `/api/v1/todos/<id>/` | Yes | Update a todo |
| PATCH | `/api/v1/todos/<id>/` | Yes | Partially update a todo |
| DELETE | `/api/v1/todos/<id>/` | Yes | Delete a todo |

See [API_DOCS.md](backend/API_DOCS.md) for full request/response examples.

---

## Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `status` | Filter by status | `?status=completed` or `?status=pending` |
| `search` | Search by title | `?search=groceries` |
| `sort_by` | Sort by field | `?sort_by=title` or `?sort_by=created_at` |
| `order` | Sort direction | `?order=asc` or `?order=desc` |
| `page` | Page number | `?page=2` |
| `limit` | Items per page (max 100) | `?limit=5` |

---

## Running Backend Tests

### Make sure containers are running
```bash
docker-compose up -d
```

### Run tests with coverage report
```bash
docker-compose exec web pytest tests/ -v
```

---

## Frontend Build

### Development server
```bash
npm run dev
```

### Production build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## Backend Useful Commands

### Start in background
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### Stop and delete all data
```bash
docker-compose down -v
```

### Create a superuser
```bash
docker-compose exec web python manage.py createsuperuser
```

### Access Django admin panel
```
http://localhost:8000/admin/
```

---

## Troubleshooting

### Backend not starting
```bash
# Full clean restart
docker-compose down -v --remove-orphans
docker rmi todo_app:latest
docker-compose up --build
```

### Clean all Docker cache
```bash
# Warning: removes all unused Docker data
docker system prune -f
docker-compose up --build
```

### Frontend not connecting to backend
Make sure:
1. Backend is running at `http://localhost:8000`
2. `.env` has correct `VITE_API_BASE_URL`
3. CORS is configured in backend `settings.py`

---

## Security Notes

- `secrets/` is in `.gitignore`
- All credentials managed via Docker secrets
- JWT access tokens expire after 1 hour
- JWT refresh tokens expire after 7 days
- `ALLOWED_HOSTS = ["*"]` — restrict in production
- `DEBUG = True` — set to `False` in production

