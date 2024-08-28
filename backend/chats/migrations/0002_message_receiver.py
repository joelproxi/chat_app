# Generated by Django 5.0.7 on 2024-08-27 23:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='receiver',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]