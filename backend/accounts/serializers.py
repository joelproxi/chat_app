
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from .models import CustomUserModel

class CustomUserModelSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUserModel
        fields = ['id', 'telephone', 'email', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 5, 'max_length': 50}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)
        if not password and not password2:
            raise serializers.ValidationError(_("You must provide either a password or a  confirm password"))
        if password != password2:
            raise serializers.ValidationError(_("Passwords do not match"))
        user = self.Meta.model(**validated_data)
        user.set_password(password)
        user.save()
        return user
