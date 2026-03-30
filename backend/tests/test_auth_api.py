import pytest
from django.urls import reverse
from tests.conftest import TEST_PASS

WRONG_PASS = "wrongpass"


@pytest.mark.django_db
class TestRegisterAPI:

    def test_register_success(self, api_client):
        response = api_client.post(reverse("users:register"), {
            "name": "John Doe",
            "email": "john@example.com",
            "password": TEST_PASS,
        })
        assert response.status_code == 201
        assert response.data["email"] == "john@example.com"
        assert response.data["name"] == "John Doe"
        assert "password" not in response.data

    def test_register_duplicate_email(self, api_client, user):
        response = api_client.post(reverse("users:register"), {
            "name": "John Doe",
            "email": "test@example.com",
            "password": TEST_PASS,
        })
        assert response.status_code == 400
        assert "error" in response.data

    def test_register_missing_fields(self, api_client):
        response = api_client.post(reverse("users:register"), {
            "email": "john@example.com",
        })
        assert response.status_code == 400
        assert "error" in response.data


@pytest.mark.django_db
class TestLoginAPI:

    def test_login_success(self, api_client, user):
        response = api_client.post(reverse("users:login"), {
            "email": "test@example.com",
            "password": TEST_PASS,
        })
        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == "test@example.com"

    def test_login_wrong_password(self, api_client, user):
        response = api_client.post(reverse("users:login"), {
            "email": "test@example.com",
            "password": WRONG_PASS,
        })
        assert response.status_code == 400
        assert "error" in response.data

    def test_login_nonexistent_user(self, api_client):
        response = api_client.post(reverse("users:login"), {
            "email": "nobody@example.com",
            "password": TEST_PASS,
        })
        assert response.status_code == 400
        assert "error" in response.data