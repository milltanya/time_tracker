from django.db import models


class Position(models.Model):
    name = models.CharField(max_length=100, primary_key=True)


class Employee(models.Model):
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=30, primary_key=True)
    position = models.ForeignKey(to=Position, on_delete=models.SET_NULL, null=True)


class Log(models.Model):
    browser = models.CharField(max_length=30)
    user = models.ForeignKey(to=Employee, on_delete=models.CASCADE)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True)
    tab_name = models.CharField(max_length=200)
    url = models.URLField()
    background = models.BooleanField()
