import datetime

import jwt
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

from accounts.models import UserModeToken

UserModel = get_user_model()

class JWTAuthentication(BaseAuthentication):

    keyword = 'Bearer'

    def authenticate(self, request):
        jwt_token = JWTAuthentication.get_token_from_header(request)
        if jwt_token is None:
            return None

        try:
            payload = jwt.decode(jwt_token, key=settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.exceptions.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed(_("Token expired"))
        except jwt.exceptions.InvalidTokenError:
            raise exceptions.AuthenticationFailed(_("Invalid token"))
        except jwt.exceptions.InvalidSignatureError:
            raise exceptions.AuthenticationFailed(_("Invalid signature"))

        user = UserModel.objects.filter(email=payload['email']).first()
        if not user:
            user = UserModel.objects.filter(telephone=payload['telephone']).first()
            if not user:
                raise exceptions.AuthenticationFailed(_("User not found"))
        if not UserModeToken.objects.filter(
                user=user,
                token=jwt_token,
                expired_at__gt=datetime.datetime.now(tz=datetime.timezone.utc)
        ).exists():
            raise exceptions.AuthenticationFailed(_("Unauthenticated"))
        return user, None

    @classmethod
    def get_token_from_header(cls, request):
        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        if not jwt_token:
            return None
        data = jwt_token.split(' ')
        if len(data) != 2 or data[0].lower() != cls.keyword.lower():
            raise exceptions.AuthenticationFailed(_("Token is malformed"))
        return data[1]

    @staticmethod
    def create_jwt_token(user):
        payload = {
            "id": user.pk,
            'email': user.email,
            'telephone': user.telephone,
            'exp': datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=1),
            'iat': datetime.datetime.now(tz=datetime.timezone.utc)
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
