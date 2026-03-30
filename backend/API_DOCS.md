# Todo API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication

All `/todos/` endpoints require a JWT token in the header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Register

`POST /auth/register/`

**Request:**
```json
{
    "name": "Emon Hasan",
    "email": "emon@example.com",
    "password": "emon1234"
}
```

> Password must be at least 8 characters.

**Response `201`:**
```json
{
    "id": 1,
    "name": "Emon Hasan",
    "email": "emon@example.com",
    "created_at": "2026-03-10T00:00:00Z"
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 400 | Missing fields / duplicate email / password too short (min 8 chars) |

---

### Login

`POST /auth/login/`

**Request:**
```json
{
    "email": "emon@example.com",
    "password": "emon1234"
}
```

**Response `200`:**
```json
{
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>",
    "user": {
        "id": 1,
        "name": "Emon Hasan",
        "email": "emon@example.com"
    }
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 400 | Invalid email or password |

---

## Todo Endpoints

### List TODOs

`GET /todos/`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | int | Page number | `?page=2` |
| `limit` | int | Items per page (max 100) | `?limit=5` |
| `status` | string | `completed` or `pending` | `?status=pending` |
| `search` | string | Search by title | `?search=groceries` |
| `sort_by` | string | `created_at` or `title` | `?sort_by=title` |
| `order` | string | `asc` or `desc` | `?order=asc` |

**Response `200`:**
```json
{
    "count": 20,
    "total_pages": 2,
    "current_page": 1,
    "next": "http://localhost:8000/api/v1/todos/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Buy sports product",
            "description": "Cricket bat and Chess board",
            "is_completed": false,
            "created_at": "2026-03-10T00:00:00Z",
            "updated_at": "2026-03-10T00:00:00Z"
        }
    ]
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 401 | Missing or invalid token |

---

### Create TODO

`POST /todos/`

**Request:**
```json
{
    "title": "Work on Todo-API project",
    "description": "Fix bugs and refactor code"
}
```

> `description` is optional. `title` max length is 255 characters.

**Response `201`:**
```json
{
    "id": 1,
    "title": "Work on Todo-API project",
    "description": "Fix bugs and refactor code",
    "is_completed": false,
    "created_at": "2026-03-10T00:00:00Z",
    "updated_at": "2026-03-10T00:00:00Z"
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 400 | Missing or empty title / title exceeds 255 characters |
| 401 | Missing or invalid token |

---

### Get TODO

`GET /todos/<id>/`

**Response `200`:**
```json
{
    "id": 1,
    "title": "Work on Todo-API project",
    "description": "Fix bugs and refactor code",
    "is_completed": false,
    "created_at": "2026-03-10T00:00:00Z",
    "updated_at": "2026-03-10T00:00:00Z"
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 401 | Missing or invalid token |
| 404 | Todo not found or belongs to another user |

---

### Update TODO

`PUT /todos/<id>/`

**Request:**
```json
{
    "title": "Work on Todo-API project",
    "description": "Fix bugs, refactor code and write API documentation",
    "is_completed": false
}
```

**Response `200`:**
```json
{
    "id": 1,
    "title": "Work on Todo-API project",
    "description": "Fix bugs, refactor code and write API documentation",
    "is_completed": false,
    "created_at": "2026-03-10T00:00:00Z",
    "updated_at": "2026-03-10T01:00:00Z"
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 400 | Missing or empty title / title exceeds 255 characters |
| 401 | Missing or invalid token |
| 404 | Todo not found or belongs to another user |

---

### Partial Update TODO

`PATCH /todos/<id>/`

**Request:**
```json
{
    "is_completed": true
}
```

**Response `200`:**
```json
{
    "id": 1,
    "title": "Work on Todo-API project",
    "description": "Fix bugs, refactor code and write API documentation",
    "is_completed": true,
    "created_at": "2026-03-10T00:00:00Z",
    "updated_at": "2026-03-10T01:00:00Z"
}
```

**Errors:**
| Code | Reason |
|------|--------|
| 400 | Empty title / title exceeds 255 characters |
| 401 | Missing or invalid token |
| 404 | Todo not found or belongs to another user |

---

### Delete TODO

`DELETE /todos/<id>/`

**Response `204`:** No content

**Errors:**
| Code | Reason |
|------|--------|
| 401 | Missing or invalid token |
| 404 | Todo not found or belongs to another user |

---

## Error Format

All errors follow this format:
```json
{
    "error": "Error message here.",
    "code": 400
}
```