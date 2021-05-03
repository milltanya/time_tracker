from datetime import datetime

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Position, Employee, Log
from .serializers import PositionSerializer, EmployeeSerializer, LogSerializer


@api_view(['GET', 'POST'])
def position_list(request):
    if request.method == 'GET':
        positions = Position.objects.all()
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PositionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def employee_list(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def log_list(request):
    if request.method == 'GET':
        logs = Log.objects.all()
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data['start'], int):
            request.data['start'] = datetime.fromtimestamp(request.data['start'] / 1000.0)
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            log = Log.objects.get(id=serializer.data['id'])
            prev_log = Log.objects\
                .filter(user__exact=log.user)\
                .filter(start__lt=log.start)\
                .order_by('start')\
                .last()
            if prev_log:
                prev_log.end = log.start
                prev_log.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
