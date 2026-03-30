from rest_framework import generics

from .filters import TodoFilter, TodoOrdering
from .models import Todo
from .serializers import TodoSerializer


class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    filterset_class = TodoFilter

    def get_queryset(self):
        queryset = Todo.objects.filter(user=self.request.user)
        queryset = TodoOrdering.apply(
            queryset,
            sort_by=self.request.query_params.get("sort_by"),
            order=self.request.query_params.get("order"),
        )
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    

