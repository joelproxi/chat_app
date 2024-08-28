from django.contrib import admin

from accounts.models import CustomUserModel, UserModeToken

# Register your models here.

admin.site.register([CustomUserModel, UserModeToken])