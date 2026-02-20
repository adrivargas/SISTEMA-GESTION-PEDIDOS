from rest_framework import serializers


class MenuSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=100, required=False, allow_blank=True)
    price = serializers.FloatField(min_value=0)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)


class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(
        choices=["CREATED", "SENT_TO_KITCHEN", "SERVED", "PAID", "CANCELLED"]
    )
    source = serializers.ChoiceField(choices=["WEB", "MOBILE", "SYSTEM"])
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(required=False)
