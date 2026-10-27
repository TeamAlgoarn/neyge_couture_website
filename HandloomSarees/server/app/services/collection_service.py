# # from fastapi import HTTPException, status

# # from app.repositories.collection_repository import CollectionRepository
# # from app.schemas.collection import CollectionCreateRequest, CollectionUpdateRequest
# # from app.utils.slug import slugify


# # class CollectionService:
# #     @staticmethod
# #     def create(payload: CollectionCreateRequest) -> dict:
# #         slug = payload.slug.strip().lower() if payload.slug else slugify(payload.name)

# #         if CollectionRepository.exists_by_slug(slug):
# #             raise HTTPException(
# #                 status_code=status.HTTP_409_CONFLICT,
# #                 detail="Collection slug already exists",
# #             )

# #         data = payload.model_dump()
# #         data["slug"] = slug
# #         return CollectionRepository.create(data)

# #     @staticmethod
# #     def list_active() -> list[dict]:
# #         return CollectionRepository.list_active()

# #     @staticmethod
# #     def get_by_slug(slug: str) -> dict:
# #         collection = CollectionRepository.get_by_slug(slug)
# #         if not collection:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Collection not found",
# #             )
# #         return collection

# #     @staticmethod
# #     def update(collection_id: str, payload: CollectionUpdateRequest) -> dict:
# #         existing = CollectionRepository.get_by_id(collection_id)
# #         if not existing:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Collection not found",
# #             )

# #         data = payload.model_dump(exclude_unset=True)

# #         if "slug" in data and data["slug"]:
# #             data["slug"] = slugify(data["slug"])
# #         elif "name" in data and data["name"]:
# #             data["slug"] = slugify(data["name"])

# #         if data.get("slug") and CollectionRepository.exists_by_slug(data["slug"], exclude_id=collection_id):
# #             raise HTTPException(
# #                 status_code=status.HTTP_409_CONFLICT,
# #                 detail="Collection slug already exists",
# #             )

# #         updated = CollectionRepository.update(collection_id, data)
# #         if not updated:
# #             raise HTTPException(
# #                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #                 detail="Failed to update collection",
# #             )
# #         return updated

# #     @staticmethod
# #     def soft_delete(collection_id: str) -> dict:
# #         existing = CollectionRepository.get_by_id(collection_id)
# #         if not existing:
# #             raise HTTPException(
# #                 status_code=status.HTTP_404_NOT_FOUND,
# #                 detail="Collection not found",
# #             )
# #         return CollectionRepository.update(collection_id, {"is_active": False})





# from fastapi import HTTPException, status

# from app.repositories.collection_repository import CollectionRepository
# from app.schemas.collection import CollectionCreateRequest, CollectionUpdateRequest
# from app.utils.slug import slugify
# from neyge_couture_website.HandloomSarees.server.app.repositories import collection_repository


# class CollectionService:
#     @staticmethod
#     def create(payload: CollectionCreateRequest) -> dict:
#         slug = payload.slug.strip().lower() if payload.slug else slugify(payload.name)

#         if CollectionRepository.exists_by_slug(slug):
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Collection slug already exists",
#             )

#         data = payload.model_dump()
#         data["slug"] = slug
#         return CollectionRepository.create(data)

#     @staticmethod
#     def list_active() -> list[dict]:
#         return CollectionRepository.list_active()

#     @staticmethod
#     def get_by_slug(slug: str) -> dict:
#         collection = CollectionRepository.get_by_slug(slug)
#         if not collection:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Collection not found",
#             )
#         return collection

#     @staticmethod
#     def update(collection_id: str, payload: CollectionUpdateRequest) -> dict:
#         existing = CollectionRepository.get_by_id(collection_id)
#         if not existing:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Collection not found",
#             )

#         data = payload.model_dump(exclude_unset=True)

#         if "slug" in data and data["slug"]:
#             data["slug"] = slugify(data["slug"])
#         elif "name" in data and data["name"]:
#             data["slug"] = slugify(data["name"])

#         if data.get("slug") and CollectionRepository.exists_by_slug(
#             data["slug"], exclude_id=collection_id
#         ):
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Collection slug already exists",
#             )

#         updated = CollectionRepository.update(collection_id, data)
#         if not updated:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to update collection",
#             )
#         return updated

#     @staticmethod
#     def soft_delete(collection_id: str) -> dict:
#         existing = CollectionRepository.get_by_id(collection_id)
#         if not existing:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Collection not found",
#             )

#         updated = CollectionRepository.update(collection_id, {"is_active": False})
#         if not updated:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to delete collection",
#             )
#         return updated
    
# async def get_collection(slug: str):
#     collection = await collection_repository.get_collection_by_slug(slug)

#     if not collection:
#         raise Exception("Collection not found")

#     return collection







from fastapi import HTTPException, status

from app.repositories.collection_repository import CollectionRepository
from app.schemas.collection import CollectionCreateRequest, CollectionUpdateRequest
from app.utils.slug import slugify


class CollectionService:
    @staticmethod
    def _unique_slug(base_slug: str, exclude_id: str | None = None) -> str:
        base = slugify(base_slug) or "collection"
        if not CollectionRepository.exists_by_slug(base, exclude_id=exclude_id):
            return base

        for suffix in range(2, 10000):
            candidate = f"{base}-{suffix}"
            if not CollectionRepository.exists_by_slug(candidate, exclude_id=exclude_id):
                return candidate

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to generate a unique collection slug",
        )

    @staticmethod
    def create(payload: CollectionCreateRequest) -> dict:
        slug_source = payload.slug or payload.name
        slug = CollectionService._unique_slug(slug_source)

        data = payload.model_dump()
        if "sort_order" not in payload.model_fields_set:
            data.pop("sort_order", None)
        data["slug"] = slug
        return CollectionRepository.create(data)

    @staticmethod
    def list_active() -> list[dict]:
        return CollectionRepository.list_active()

    @staticmethod
    def list_homepage() -> list[dict]:
        return CollectionRepository.list_homepage()

    @staticmethod
    def get_by_slug(slug: str) -> dict:
        collection = CollectionRepository.get_by_slug(slug)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Collection not found",
            )
        return collection

    @staticmethod
    def get_by_id(collection_id: str) -> dict:
        collection = CollectionRepository.get_by_id(collection_id)
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Collection not found",
            )
        return collection

    @staticmethod
    def update(collection_id: str, payload: CollectionUpdateRequest) -> dict:
        existing = CollectionRepository.get_by_id(collection_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Collection not found",
            )

        data = payload.model_dump(exclude_unset=True)

        if "slug" in data:
            if data["slug"]:
                data["slug"] = CollectionService._unique_slug(
                    data["slug"], exclude_id=collection_id
                )
            else:
                data.pop("slug")

        updated = CollectionRepository.update(collection_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update collection",
            )
        return updated

    @staticmethod
    def soft_delete(collection_id: str) -> dict:
        existing = CollectionRepository.get_by_id(collection_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Collection not found",
            )

        updated = CollectionRepository.update(collection_id, {"is_active": False})
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete collection",
            )
        return updated
