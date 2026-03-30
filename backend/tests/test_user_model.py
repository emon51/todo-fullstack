import pytest
from django.contrib.auth import get_user_model

from tests.conftest import TEST_PASS

user_model = get_user_model()


@pytest.mark.django_db
class TestUserManager:

    def test_create_user_success(self):
        user = user_model.objects.create_user(
            email="user@example.com",
            password=TEST_PASS,
            name="Test User",
        )
        assert user.email == "user@example.com"
        assert user.name == "Test User"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.check_password(TEST_PASS)

    def test_create_user_normalizes_email(self):
        user = user_model.objects.create_user(
            email="User@EXAMPLE.COM",
            password=TEST_PASS,
            name="Test User",
        )
        assert user.email == "user@example.com"

    def test_create_user_without_email_raises(self):
        with pytest.raises(ValueError, match="Email is required."):
            user_model.objects.create_user(email="", password=TEST_PASS, name="Test")

    def test_create_superuser_success(self):
        user = user_model.objects.create_superuser(
            email="admin@example.com",
            password=TEST_PASS,
            name="Admin",
        )
        assert user.is_staff is True
        assert user.is_superuser is True