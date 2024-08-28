
from django.urls import path

from rest_framework.routers import DefaultRouter

from chats import views


router = DefaultRouter()

router.register('conversations', views.ConversationViewSet, basename='conversations')


urlpatterns = [
    path('messages/', views.MessageAPIView.as_view(), name='messages'),
] + router.urls

