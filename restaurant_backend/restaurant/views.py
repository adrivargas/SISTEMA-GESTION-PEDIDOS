from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from .models import Table, Order
from .serializers import TableSerializer, OrderSerializer
from .permissions import IsAdminOrReadOnly
from .mongo import db


def create_order_event_in_mongo(order_id: int, event_type: str = "CREATED", source: str = "WEB", note: str = ""):
    col = db["order_events"]
    col.insert_one({
        "order_id": order_id,
        "event_type": event_type,
        "source": source,
        "note": note or "",
        "created_at": timezone.now(),
    })


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by("id")
    serializer_class = TableSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name", "capacity", "created_at"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("table").all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["table", "status"]
    search_fields = ["items_summary"]
    ordering_fields = ["id", "total", "status", "created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        order = serializer.save()
        source = self.request.data.get("source", "WEB")
        note = self.request.data.get("note", "")
        create_order_event_in_mongo(
            order_id=order.id,
            event_type="CREATED",
            source=source,
            note=note,
        )
