from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password


class CustomUserModelManager(BaseUserManager):
    def _create_user(self, email: str = None, telephone: str = None, password: str = None, **extra_fields):
        if not email and not telephone:
            raise ValueError(_("The given email or telephone must be set"))

        if email:
            email = self.normalize_email(email)
            user = self.model(email=email, **extra_fields)
        else:
            user = self.model(telephone=telephone, **extra_fields)

        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str = None, telephone: str = None, password: str = None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, telephone, password, **extra_fields)

    def create_superuser(self, email: str = None, telephone: str = None, password: str = None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self._create_user(email, telephone, password, **extra_fields)


class CustomUserModel(AbstractUser):
    telephone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = None

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['telephone']

    objects = CustomUserModelManager()

    def __str__(self) -> str:
        return f'{self.first_name} {self.last_name}'


class UserModeToken(models.Model):
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField()