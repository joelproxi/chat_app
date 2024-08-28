from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import CustomUserModelSerializer
from chats.models import Conversation, Message, ConversationGroup, File

User = get_user_model()

class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = '__all__'

    def get_last_message(self, obj):
        messages = obj.messages.all().order_by("-sent_at")
        if not messages.exists():
            return None
        message = messages[0]
        return MessageSerializer(message).data

    def get_other_user(self, obj):
        telephones = obj.name.split("__")
        context = {}
        print(self.context)
        for telephone in telephones:
            if telephone != self.context["user"].telephone:
                # This is the other participant
                other_user = User.objects.get(telephone=telephone)
                return CustomUserModelSerializer(other_user, context=context).data


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationGroup
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    conversation = serializers.SerializerMethodField()
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_conversation(self, obj):
        return str(obj.conversation.id)

    def get_sender(self, obj):
        return CustomUserModelSerializer(obj.sender).data

    def get_receiver(self, obj):
        return CustomUserModelSerializer(obj.receiver).data


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
