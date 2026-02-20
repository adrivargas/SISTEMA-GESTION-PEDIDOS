from django.db import models
from django.core.validators import MinValueValidator


class Table(models.Model):
    name = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "restaurant_table"
        ordering = ["id"]

    def __str__(self):
        return f"Mesa {self.name} (cap. {self.capacity})"


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        IN_PROGRESS = "IN_PROGRESS", "En progreso"
        SERVED = "SERVED", "Servido"
        PAID = "PAID", "Pagado"

    table = models.ForeignKey(Table, on_delete=models.PROTECT, related_name="orders")
    items_summary = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "restaurant_order"
        ordering = ["-id"]

    def __str__(self):
        return f"Orden #{self.id} - {self.table.name} - {self.status}"
