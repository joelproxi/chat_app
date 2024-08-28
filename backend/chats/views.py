from pyexpat.errors import messages

from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.authentications import JWTAuthentication
from chats.models import Conversation, Message
from chats.serializers import ConversationSerializer, MessageSerializer


# Create your views here.
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.none()
    permission_classes = (IsAuthenticated,)
    lookup_field = "name"

    def get_queryset(self):
        qs = Conversation.objects.filter(
            name__contains=self.request.user.telephone
        ).order_by("-created_at")
        return qs

    def get_serializer_context(self):
        return {"request": self.request, "user": self.request.user}


@api_view(['POST'])
def set_conversation_password(request, conversation_id):
    conversation = Conversation.objects.get(id=conversation_id)
    password = request.data.get('password')

    if not password:
        return Response({'error': 'Password required'}, status=status.HTTP_400_BAD_REQUEST)

    conversation.set_password(password)
    conversation.password_enabled = True
    conversation.save()
    return Response({'success': 'Password set successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def disable_conversation_password(request, conversation_id):
    conversation = Conversation.objects.get(id=conversation_id)
    conversation.password_enabled = False
    conversation.password = None  # Clear the password
    conversation.save()
    return Response({'success': 'Password disabled successfully'}, status=status.HTTP_200_OK)


class MessageAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication, )

    def get(self, request):
        conversation_name = request.query_params.get('conversation_name', None)
        print("Conversation_name ", conversation_name)
        if conversation_name is None:
            return Response({'error': 'Conversation name required'}, status=status.HTTP_400_BAD_REQUEST)
        conversation = Conversation.objects.filter(name=conversation_name).first()
        print("Conversation" , conversation)
        all_messages = conversation.messages.all()
        serializer = MessageSerializer(all_messages, many=True)
        print("Messages :", all_messages)
        return Response(serializer.data, status=status.HTTP_200_OK)