import pytest
from apps.todos.serializers import TodoSerializer


class TestTodoSerializer:

    def test_valid_data(self):
        data = {"title": "Buy milk", "description": "From the store"}
        serializer = TodoSerializer(data=data)
        assert serializer.is_valid()

    def test_missing_title(self):
        serializer = TodoSerializer(data={"description": "No title"})
        assert not serializer.is_valid()
        assert "title" in serializer.errors

    def test_empty_title(self):
        serializer = TodoSerializer(data={"title": ""})
        assert not serializer.is_valid()
        assert "title" in serializer.errors

    def test_whitespace_title(self):
        serializer = TodoSerializer(data={"title": "   "})
        assert not serializer.is_valid()
        assert "title" in serializer.errors

    def test_title_too_long(self):
        serializer = TodoSerializer(data={"title": "x" * 256})
        assert not serializer.is_valid()
        assert "title" in serializer.errors

    def test_title_max_length(self):
        serializer = TodoSerializer(data={"title": "x" * 255})
        assert serializer.is_valid()

    def test_description_optional(self):
        serializer = TodoSerializer(data={"title": "Valid title"})
        assert serializer.is_valid()

    def test_read_only_fields(self):
        data = {"title": "Test", "id": 99, "created_at": "2020-01-01"}
        serializer = TodoSerializer(data=data)
        assert serializer.is_valid()
        assert "id" not in serializer.validated_data
        assert "created_at" not in serializer.validated_data