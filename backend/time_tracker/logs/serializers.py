from rest_framework import serializers

from .models import Position, Employee, Log


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        exclude = []


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        exclude = []


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        exclude = []
