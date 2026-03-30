import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        response.data = {
            "error": _extract_message(response.data),
            "code": response.status_code,
        }
        return response

    logger.exception("Unhandled error: %s", exc)
    return Response(
        {"error": "An unexpected error occurred.", "code": 500},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def _extract_message(data) -> str:
    if isinstance(data, str):
        return data
    if isinstance(data, list):
        return " ".join(_extract_message(i) for i in data)
    if isinstance(data, dict):
        if "detail" in data:
            return str(data["detail"])
        parts = []
        for key, value in data.items():
            msg = _extract_message(value)
            parts.append(f"{key}: {msg}" if key != "non_field_errors" else msg)
        return " | ".join(parts)
    return str(data)