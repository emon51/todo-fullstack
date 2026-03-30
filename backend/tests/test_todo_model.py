import pytest
from apps.todos.models import Todo


@pytest.mark.django_db
class TestTodoModel:

    def test_create_todo_success(self, user):
        todo = Todo.objects.create(
            user=user,
            title="Test Todo",
            description="Test Description",
        )
        assert todo.title == "Test Todo"
        assert todo.description == "Test Description"
        assert todo.is_completed is False
        assert todo.user == user

    def test_todo_str(self, user):
        todo = Todo.objects.create(user=user, title="My Todo")
        assert str(todo) == "My Todo"

    def test_todo_default_is_completed(self, user):
        todo = Todo.objects.create(user=user, title="My Todo")
        assert todo.is_completed is False

    def test_todo_ordering(self, user):
        todo1 = Todo.objects.create(user=user, title="First")
        todo2 = Todo.objects.create(user=user, title="Second")
        todos = list(Todo.objects.filter(user=user))
        assert todos[0] == todo2  # newest first
        assert todos[1] == todo1