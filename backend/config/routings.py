

from django.urls import path, re_path

from chats import consumers


websocket_urlpatterns = [
    path('<conversation_name>/', consumers.ChatMessageConsumer.as_asgi() ),
]