import pytest
from django.urls import reverse
from apps.todos.models import Todo


@pytest.mark.django_db
class TestTodoListCreateAPI:

    def test_list_todos_unauthenticated(self, api_client):
        response = api_client.get(reverse("todos:todo-list-create"))
        assert response.status_code == 401

    def test_list_todos_authenticated(self, auth_client, todo):
        response = auth_client.get(reverse("todos:todo-list-create"))
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_list_todos_only_own(self, auth_client, another_user):
        Todo.objects.create(user=another_user, title="Another users todo")
        response = auth_client.get(reverse("todos:todo-list-create"))
        assert response.status_code == 200
        assert response.data["count"] == 0

    def test_create_todo_success(self, auth_client):
        response = auth_client.post(reverse("todos:todo-list-create"), {
            "title": "New Todo",
            "description": "Some description",
        })
        assert response.status_code == 201
        assert response.data["title"] == "New Todo"
        assert response.data["is_completed"] is False

    def test_create_todo_unauthenticated(self, api_client):
        response = api_client.post(reverse("todos:todo-list-create"), {
            "title": "New Todo",
        })
        assert response.status_code == 401

    def test_create_todo_empty_title(self, auth_client):
        response = auth_client.post(reverse("todos:todo-list-create"), {
            "title": "",
        })
        assert response.status_code == 400
        assert "error" in response.data

    def test_create_todo_missing_title(self, auth_client):
        response = auth_client.post(reverse("todos:todo-list-create"), {
            "description": "No title",
        })
        assert response.status_code == 400
        assert "error" in response.data


@pytest.mark.django_db
class TestTodoRetrieveUpdateDestroyAPI:

    def test_retrieve_todo_success(self, auth_client, todo):
        response = auth_client.get(reverse("todos:todo-detail", args=[todo.id]))
        assert response.status_code == 200
        assert response.data["title"] == todo.title

    def test_retrieve_todo_not_found(self, auth_client):
        response = auth_client.get(reverse("todos:todo-detail", args=[999]))
        assert response.status_code == 404
        assert "error" in response.data

    def test_retrieve_other_users_todo(self, auth_client, another_user):
        other_todo = Todo.objects.create(user=another_user, title="Not yours")
        response = auth_client.get(reverse("todos:todo-detail", args=[other_todo.id]))
        assert response.status_code == 404

    def test_update_todo_success(self, auth_client, todo):
        response = auth_client.put(reverse("todos:todo-detail", args=[todo.id]), {
            "title": "Updated Title",
            "description": "Updated",
            "is_completed": True,
        })
        assert response.status_code == 200
        assert response.data["title"] == "Updated Title"
        assert response.data["is_completed"] is True

    def test_partial_update_todo(self, auth_client, todo):
        response = auth_client.patch(reverse("todos:todo-detail", args=[todo.id]), {
            "is_completed": True,
        })
        assert response.status_code == 200
        assert response.data["is_completed"] is True

    def test_delete_todo_success(self, auth_client, todo):
        response = auth_client.delete(reverse("todos:todo-detail", args=[todo.id]))
        assert response.status_code == 204
        assert not Todo.objects.filter(id=todo.id).exists()

    def test_delete_other_users_todo(self, auth_client, another_user):
        other_todo = Todo.objects.create(user=another_user, title="Not yours")
        response = auth_client.delete(reverse("todos:todo-detail", args=[other_todo.id]))
        assert response.status_code == 404


@pytest.mark.django_db
class TestTodoFiltersAPI:

    def test_filter_by_status_completed(self, auth_client, user):
        Todo.objects.create(user=user, title="Done", is_completed=True)
        Todo.objects.create(user=user, title="Pending", is_completed=False)
        response = auth_client.get(reverse("todos:todo-list-create") + "?status=completed")
        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["title"] == "Done"

    def test_filter_by_status_pending(self, auth_client, user):
        Todo.objects.create(user=user, title="Done", is_completed=True)
        Todo.objects.create(user=user, title="Pending", is_completed=False)
        response = auth_client.get(reverse("todos:todo-list-create") + "?status=pending")
        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["title"] == "Pending"

    def test_search_by_title(self, auth_client, user):
        Todo.objects.create(user=user, title="Buy groceries")
        Todo.objects.create(user=user, title="Go to gym")
        response = auth_client.get(reverse("todos:todo-list-create") + "?search=groceries")
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_sort_by_title_asc(self, auth_client, user):
        Todo.objects.create(user=user, title="Zebra")
        Todo.objects.create(user=user, title="Apple")
        response = auth_client.get(
            reverse("todos:todo-list-create") + "?sort_by=title&order=asc"
        )
        assert response.status_code == 200
        assert response.data["results"][0]["title"] == "Apple"

    def test_pagination(self, auth_client, user):
        for i in range(15):
            Todo.objects.create(user=user, title=f"Todo {i}")
        response = auth_client.get(reverse("todos:todo-list-create") + "?limit=10")
        assert response.status_code == 200
        assert response.data["count"] == 15
        assert len(response.data["results"]) == 10