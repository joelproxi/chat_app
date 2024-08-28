from datetime import timezone, datetime

from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from django.utils.formats import date_format

UserModel = get_user_model()


class Conversation(models.Model):
    name = models.CharField(max_length=100)
    is_group = models.BooleanField(default=False)
    members = models.ManyToManyField(UserModel, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    password = models.CharField(max_length=128, blank=True)
    password_enabled = models.BooleanField(default=False)

    def set_password(self, password):
        self.password_enabled = make_password(password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Message(models.Model):
    class MessageStatus(models.TextChoices):
        SEND = "SE", "Send"
        RECEIVED = "RE", "Received"
        DELIVERED = "DE", "Delivered"
        PENDING = "PN", "Pending"
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(UserModel, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(UserModel, related_name='receiver', on_delete=models.CASCADE)
    content = models.TextField(null=True, blank=True)
    key_id = models.CharField(max_length=255)
    sent_at = models.DateTimeField(default=datetime.now)
    status = models.CharField(default=MessageStatus.SEND, max_length=2, choices=MessageStatus.choices)


class ConversationGroup(models.Model):
    conversation = models.OneToOneField(Conversation, related_name='conversation_groups', on_delete=models.CASCADE)
    admins = models.ManyToManyField(UserModel, related_name='admins_groups')
    description = models.TextField(null=True, blank=True)


class File(models.Model):
    pass