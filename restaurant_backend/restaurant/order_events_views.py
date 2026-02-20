from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from .mongo import db
from .mongo_serializers import OrderEventSerializer

col = db["order_events"]


def fix_id(doc):
    if not doc:
        return doc
    doc = dict(doc)
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    if "created_at" in doc and doc["created_at"]:
        doc["created_at"] = doc["created_at"].isoformat()
    return doc


def oid_or_none(id_str: str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def order_events_list_create(request):
    if request.method == "GET":
        q = {}
        order_id = request.query_params.get("order_id")
        if order_id is not None:
            try:
                q["order_id"] = int(order_id)
            except ValueError:
                pass
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        if date_from or date_to:
            q["created_at"] = {}
            if date_from:
                try:
                    q["created_at"]["$gte"] = datetime.fromisoformat(date_from.replace("Z", "+00:00"))
                except ValueError:
                    pass
            if date_to:
                try:
                    q["created_at"]["$lte"] = datetime.fromisoformat(date_to.replace("Z", "+00:00"))
                except ValueError:
                    pass
        docs = [fix_id(d) for d in col.find(q).sort("created_at", -1)]
        return Response(docs)

    serializer = OrderEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    from django.utils import timezone
    data = dict(serializer.validated_data)
    data.setdefault("created_at", timezone.now())
    res = col.insert_one(data)
    doc = col.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def order_events_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    if request.method in ["PUT", "PATCH"]:
        serializer = OrderEventSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)
        col.update_one({"_id": _id}, {"$set": serializer.validated_data})
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    res = col.delete_one({"_id": _id})
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_204_NO_CONTENT)
