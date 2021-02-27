from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import position_list, employee_list, log_list

urlpatterns = format_suffix_patterns([
    path('positions/', position_list),
    path('employees/', employee_list),
    path('logs/', log_list),
])
