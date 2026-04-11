# audit/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import AuditLog
from .serializers import AuditLogSerializer
from .filters import AuditLogFilter
from accounts.permissions import IsAdminRole,HasUserPermission

class AuditlogPermissionMixin:
    def get_required_permission(self):
        mapping = {
            'list': 'audit_logs_view',
            'retrieve': 'audit_logs_view',
            'create': 'audit_logs_create',
            'update': 'audit_logs_edit',
            'partial_update': 'audit_logs_edit',
            'destroy': 'audit_logs_delete'
        }
        return mapping.get(self.action, None)



class AuditLogViewSet(ModelViewSet, AuditlogPermissionMixin):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, HasUserPermission]


    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AuditLogFilter


    search_fields = ['user__username']


    ordering_fields = ['timestamp']