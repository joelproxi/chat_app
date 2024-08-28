from django.urls import path
from rest_framework.routers import DefaultRouter

from accounts import views

router = DefaultRouter()
router.register('users', views.UserViewSet)

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),

] + router.urls

