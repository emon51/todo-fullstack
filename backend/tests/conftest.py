import pytest
from rest_framework.test import APIClient

TEST_PASS = "secret123"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def user(db):
    from django.contrib.auth import get_user_model
    user_model = get_user_model()
    return user_model.objects.create_user(
        email="test@example.com",
        password=TEST_PASS,
        name="Test User",
    )


@pytest.fixture
def another_user(db):
    from django.contrib.auth import get_user_model
    user_model = get_user_model()
    return user_model.objects.create_user(
        email="another@example.com",
        password=TEST_PASS,
        name="Another User",
    )


@pytest.fixture
def todo(db, user):
    from apps.todos.models import Todo
    return Todo.objects.create(
        user=user,
        title="Test Todo",
        description="Test Description",
    )