from django_filters import rest_framework as filters

from .constants import Status, SortOrder, VALID_SORT_FIELDS
from .models import Todo


class TodoFilter(filters.FilterSet):
    status = filters.CharFilter(method="filter_by_status")
    search = filters.CharFilter(method="filter_by_search")

    class Meta:
        model = Todo
        fields = ["status", "search"]

    def filter_by_status(self, queryset, name, value):
        if value.lower() == Status.COMPLETED:
            return queryset.filter(is_completed=True)
        if value.lower() == Status.PENDING:
            return queryset.filter(is_completed=False)
        return queryset.none()

    def filter_by_search(self, queryset, name, value):
        return queryset.filter(title__icontains=value)


class TodoOrdering:
    @staticmethod
    def apply(queryset, sort_by: str | None, order: str | None):
        sort_field = sort_by if sort_by in VALID_SORT_FIELDS else SortOrder.DEFAULT
        ordering = "" if order == SortOrder.ASC else "-"
        return queryset.order_by(f"{ordering}{sort_field}")