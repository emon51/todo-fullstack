import pytest
from apps.users.serializers import RegisterSerializer
from tests.conftest import TEST_PASS

SHORT_PASS = "123"


@pytest.mark.django_db
class TestRegisterSerializer:

    def test_valid_data(self):
        serializer = RegisterSerializer(
            data={"name": "John", "email": "john@example.com", "password": TEST_PASS}
        )
        assert serializer.is_valid()

    def test_missing_email(self):
        serializer = RegisterSerializer(
            data={"name": "John", "password": TEST_PASS}
        )
        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_missing_password(self):
        serializer = RegisterSerializer(
            data={"name": "John", "email": "john@example.com"}
        )
        assert not serializer.is_valid()
        assert "password" in serializer.errors

    def test_password_too_short(self):
        serializer = RegisterSerializer(
            data={"name": "John", "email": "john@example.com", "password": SHORT_PASS}
        )
        assert not serializer.is_valid()
        assert "password" in serializer.errors

    def test_duplicate_email(self, user):
        serializer = RegisterSerializer(
            data={"name": "John", "email": "test@example.com", "password": TEST_PASS}
        )
        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_email_normalized(self):
        serializer = RegisterSerializer(
            data={"name": "John", "email": "JOHN@EXAMPLE.COM", "password": TEST_PASS}
        )
        assert serializer.is_valid()
        assert serializer.validated_data["email"] == "john@example.com"