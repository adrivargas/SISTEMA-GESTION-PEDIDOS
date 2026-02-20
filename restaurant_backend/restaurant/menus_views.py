from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from django.utils import timezone

from .mongo import db
from .mongo_serializers import MenuSerializer

col = db["menus"]


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
def menus_list_create(request):
    if request.method == "GET":
        q = {}
        if request.query_params.get("is_available") is not None:
            q["is_available"] = request.query_params.get("is_available").lower() == "true"
        if request.query_params.get("category"):
            q["category"] = request.query_params.get("category")
        docs = [fix_id(d) for d in col.find(q)]
        return Response(docs)

    serializer = MenuSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = dict(serializer.validated_data)
    data.setdefault("created_at", timezone.now())
    res = col.insert_one(data)
    doc = col.find_one({"_id": res.inserted_id})
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def menus_detail(request, id: str):
    _id = oid_or_none(id)
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        doc = col.find_one({"_id": _id})
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))

    if request.method in ["PUT", "PATCH"]:
        serializer = MenuSerializer(data=request.data, partial=(request.method == "PATCH"))
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
