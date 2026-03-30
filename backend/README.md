# Todo API

A REST API for managing todos built with Django and PostgreSQL, running fully in Docker.

---

## Project Structure
```
todo-api-drf/
├── config/                 # Project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py             # Root URL config
│   ├── exceptions.py       # Global error handler
│   └── pagination.py       # Custom pagination
├── apps/
│   ├── users/              # Auth app (register, login)
│   └── todos/              # Todos app (CRUD, filter, search)
├── tests/                  # All tests
├── secrets/                # Credentials 
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── pytest.ini
├── API_DOCS.md
└── README.md
```


---

## Tech Stack

- Python, Django, Django REST Framework
- PostgreSQL 15
- JWT Authentication
- Docker & Docker Compose

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Quick Start
### 1. Clone the repository:
```bash
git clone https://github.com/emon51/todo-api-drf.git
cd todo-api-drf
```

### 2. Create secrets directory and files:
```bash
mkdir secrets
echo "todo_db" > secrets/db_name.txt
echo "todo_user" > secrets/db_user.txt
echo "todo_password" > secrets/db_password.txt
echo "your-secret-key-change-this" > secrets/secret_key.txt
```

### 3. Start the app:
```bash
docker-compose up --build
```

API is now running at `http://localhost:8000/api/v1/`


## Troubleshooting
If you see `could not translate host name "db"` error or any error, please run a full clean restart:
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove old image
docker rmi todo_app:latest

# Start fresh
docker-compose up --build
```

If the error still persists, kindly clean all Docker cache and try again:
```bash
# Warning: this removes all unused Docker data on your machine
docker system prune -f

docker-compose up --build
```

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/auth/register/` | No | Register a new user |
| POST | `/api/v1/auth/login/` | No | Login and get JWT tokens |
| GET | `/api/v1/todos/` | Yes | List all your todos |
| POST | `/api/v1/todos/` | Yes | Create a new todo |
| GET | `/api/v1/todos/<id>/` | Yes | Get a single todo |
| PUT | `/api/v1/todos/<id>/` | Yes | Update a todo |
| PATCH | `/api/v1/todos/<id>/` | Yes | Partially update a todo |
| DELETE | `/api/v1/todos/<id>/` | Yes | Delete a todo |

See [API_DOCS.md](API_DOCS.md) for full request/response examples.

---

## Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `status` | Filter by status | `?status=completed` or `?status=pending` |
| `search` | Search by title | `?search=groceries` |
| `sort_by` | Sort by field | `?sort_by=title` or `?sort_by=created_at` |
| `order` | Sort direction | `?order=asc` or `?order=desc` |
| `page` | Page number | `?page=2` |
| `limit` | Items per page | `?limit=5` |

---

## Running Tests
### Make sure containers are running:
```bash
docker-compose up -d
```

### Run tests with coverage report:
```bash
docker-compose exec web pytest tests/ -v
```

## Admin Panel
### Create a superuser:
```bash
docker-compose exec web python manage.py createsuperuser
```

Then open `http://localhost:8000/admin/` in your browser.

---

## Useful Commands
### Start in background:
```bash
docker-compose up -d
```

### Stop containers:
```bash
docker-compose down
```

### Stop and delete all data:
```bash
docker-compose down -v
```

---

## Security Notes

- `secrets/` is in `.gitignore`
- All credentials are managed via Docker secrets
- JWT tokens expire after 1 hour
