from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer, JsonWebsocketConsumer
from django.contrib.auth import get_user_model

from chats.models import Conversation, Message

User = get_user_model()


class ChatMessageConsumer(JsonWebsocketConsumer):
    """
       This consumer is used to show user's online status,
       and send notifications.
   """

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = 'home'
        self.user = None
        self.conversation_name = None
        self.conversation = None

    def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return

        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        if self.conversation_name == 'home': return
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)

        async_to_sync(self.channel_layer.group_add)(
            self.conversation.name,
            self.channel_name
        )
        self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )

    def disconnect(self, code):
        print("Disconnected!")
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        print(content)
        print(self.get_receiver())
        if content['type'] == 'send_message_to_user':
            Message.objects.create(sender=self.user, content=content['message'], conversation=self.conversation, receiver=self.get_receiver())
        return super().receive_json(content, **kwargs)

    def get_receiver(self):
        telephones = self.conversation_name.split("__")
        for telephone in telephones:
            if telephone != self.user.username:
                # This is the receiver
                return User.objects.get(telephone=telephone)