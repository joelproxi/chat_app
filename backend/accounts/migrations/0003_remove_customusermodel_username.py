# Generated by Django 5.0.7 on 2024-08-25 23:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_usermodetoken'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customusermodel',
            name='username',
        ),
    ]
