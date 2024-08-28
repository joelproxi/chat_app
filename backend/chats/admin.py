from django.contrib import admin

from chats.models import Message, Conversation

# Register your models here.

admin.site.register([Message, Conversation, ])