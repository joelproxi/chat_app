import datetime
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import UserModeToken

@database_sync_to_async
def get_user(scope):
    """
    Return the user model instance associated with the given scope.
    If no user is retrieved, return an instance of `AnonymousUser`.
    """
    token_key = scope.get("token")
    if not token_key:
        raise ValueError(
            "Cannot find token in scope. Ensure your consumer is wrapped in "
            "TokenAuthMiddleware."
        )

    try:
        # Fetch the token from your custom UserModeToken model
        token = UserModeToken.objects.select_related("user").get(token=token_key)
        if token.expired_at < datetime.datetime.now(tz=datetime.timezone.utc):
            raise AuthenticationFailed("Token has expired.")
        return token.user
    except UserModeToken.DoesNotExist:
        raise AuthenticationFailed("Invalid token.")
    except AuthenticationFailed:
        return AnonymousUser()

class TokenAuthMiddleware:
    """
    Custom middleware that takes a token from the query string and authenticates
    the user via the custom UserModeToken model.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Extract the token from the query string
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        if not token:
            raise ValueError("Token not found in the query string.")

        # Attach the token and the user to the scope
        scope["token"] = token
        scope["user"] = await get_user(scope)

        # Call the next ASGI application
        await self.app(scope, receive, send)