# audit/filters.py
import django_filters
from .models import AuditLog


class AuditLogFilter(django_filters.FilterSet):
    
    # 🔹 filter by action
    action = django_filters.CharFilter(field_name='action', lookup_expr='exact')

    # 🔹 date range
    from_date = django_filters.DateFilter(field_name='timestamp', lookup_expr='date__gte')
    to_date = django_filters.DateFilter(field_name='timestamp', lookup_expr='date__lte')

    class Meta:
        model = AuditLog
        fields = ['action']