from django.urls import include, path
from rest_framework import routers

from .views import PositionViewSet, EmployeeViewSet, LogViewSet

router = routers.DefaultRouter()
router.register('positions', PositionViewSet)
router.register('employees', EmployeeViewSet)
router.register('logs', LogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]