class Status:
    COMPLETED = "completed"
    PENDING = "pending"


class SortOrder:
    ASC = "asc"
    DESC = "desc"
    DEFAULT = "created_at"


VALID_SORT_FIELDS = {"created_at", "title"}