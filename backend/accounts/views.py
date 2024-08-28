from datetime import datetime, timezone, timedelta

from django.contrib.auth import get_user_model
from django.db.transaction import atomic
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from rest_framework import status, viewsets

from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.authentications import JWTAuthentication
from accounts.models import UserModeToken
from accounts.serializers import CustomUserModelSerializer

UserModel = get_user_model()

# Create your views here.

class RegisterView(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(atomic)
    def post(self, request):
        data = request.data
        print(data)
        if data['password'] != data['password2']:
            raise ValidationError(_('Passwords do not match'))

        serializer = CustomUserModelSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = JWTAuthentication.create_jwt_token(user)
        UserModeToken.objects.get_or_create(
            user=user,
            token=token,
            created=datetime.now(tz=timezone.utc),
            expired_at=datetime.now(tz=timezone.utc) + timedelta(days=1),
        )
        return Response({'token': token, "email": user.email, "id": user.id, "telephone": user.telephone},
                        status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data['username']
        password = data['password']

        user = UserModel.objects.filter(email=username).first()
        if user is None:
            user  =  UserModel.objects.filter(telephone=username).first()
            if user is None:
                raise AuthenticationFailed(_('User not found'))
        if not user.check_password(password):
            raise AuthenticationFailed(_('Incorrect password'))

        token = JWTAuthentication.create_jwt_token(user)
        UserModeToken.objects.get_or_create(
            user=user,
            token=token,
            created=datetime.now(tz=timezone.utc),
            expired_at=datetime.now(tz=timezone.utc) + timedelta(days=1),
        )
        return Response({'token': token, "email": user.email, "id": user.id, "telephone": user.telephone},
                        status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = CustomUserModelSerializer
    permission_classes = (AllowAny,)
    authentication_classes = (JWTAuthentication,)
