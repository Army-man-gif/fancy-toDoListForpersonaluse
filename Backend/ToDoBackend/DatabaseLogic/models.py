from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    myDay = models.BooleanField(default=False)
    isStarred = models.BooleanField(default=False)
    isChecked = models.BooleanField(default=False)
