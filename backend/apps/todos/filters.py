from django_filters import rest_framework as filters
from .models import Todo

VALID_SORT_FIELDS = {"created_at", "title"}


class TodoFilter(filters.FilterSet):
    status = filters.CharFilter(method="filter_by_status")
    search = filters.CharFilter(method="filter_by_search")

    class Meta:
        model = Todo
        fields = ["status", "search"]

    def filter_by_status(self, queryset, name, value):
        if value.lower() == "completed":
            return queryset.filter(is_completed=True)
        if value.lower() == "pending":
            return queryset.filter(is_completed=False)
        return queryset.none()

    def filter_by_search(self, queryset, name, value):
        return queryset.filter(title__icontains=value)


class TodoOrdering:
    @staticmethod
    def apply(queryset, sort_by: str | None, order: str | None):
        sort_field = sort_by if sort_by in VALID_SORT_FIELDS else "created_at"
        ordering = "" if order == "asc" else "-"
        return queryset.order_by(f"{ordering}{sort_field}")


