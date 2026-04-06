from math import ceil
from typing import Any


def build_pagination(page: int, page_size: int, total: int) -> dict[str, Any]:
    total_pages = ceil(total / page_size) if total > 0 else 1
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }