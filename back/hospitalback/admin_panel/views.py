from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog
from .serializers import AuditLogSerializer
from accounts.permissions import CustomDjangoModelPermissions,HasUserPermission
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import GeneralSettingsSerializer, SecuritySettingsSerializer, NotificationSettingsSerializer, IntegrationSettingsSerializer
from .models import GeneralSettings, SecuritySettings, NotificationSettings, IntegrationSettings
from .filters import AuditLogFilter
import csv
from django.http import HttpResponse
from rest_framework.decorators import action

class AuditLogViewSet(ModelViewSet):
    queryset = AuditLog.objects.select_related('user').all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    required_permissions = ['admin_panel.export_auditlog']

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # 🔹 use custom filter
    filterset_class = AuditLogFilter

    search_fields = ['user__first_name', 'user__last_name', 'user__email']

    ordering_fields = ['timestamp']

    @action(detail=False, methods=['get'], url_path='export-csv',permission_classes=[IsAuthenticated, HasUserPermission])
    def export_csv(self, request):

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="audit_logs.csv"'

        writer = csv.writer(response)

        writer.writerow([
            'ID',
            'User',
            'Action',
            'Resource',
            'Severity',
            'Outcome',
            'IP Address',
            'Timestamp'
        ])

        # Data
        logs = self.filter_queryset(self.get_queryset())

        for log in logs:
            writer.writerow([
                log.id,
                log.user.get_full_name() if log.user else '',
                log.action,
                log.resource,
                log.severity,
                log.outcome,
                log.ip_address,
                log.timestamp,
            ])

        return response





class GeneralSettingsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]
    required_permissions = ['admin_panel.change_generalsettings', 'admin_panel.view_generalsettings']

    def get(self, request):
        obj, _ = GeneralSettings.objects.get_or_create()
        serializer = GeneralSettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj, _ = GeneralSettings.objects.get_or_create()
        serializer = GeneralSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    


class SecuritySettingsView(APIView):
    permission_classes = [IsAuthenticated,HasUserPermission]
    required_permissions = ['admin_panel.change_securitysettings', 'admin_panel.view_securitysettings']

    def get(self, request):
        obj, _ = SecuritySettings.objects.get_or_create()
        serializer = SecuritySettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj, _ = SecuritySettings.objects.get_or_create()
        serializer = SecuritySettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    



class NotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated,HasUserPermission]
    required_permissions = ['admin_panel.change_notificationsettings', 'admin_panel.view_notificationsettings']

    def get(self, request):
        obj, _ = NotificationSettings.objects.get_or_create()
        serializer = NotificationSettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj, _ = NotificationSettings.objects.get_or_create()
        serializer = NotificationSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    



class IntegrationSettingsView(APIView):
    permission_classes = [IsAuthenticated,HasUserPermission]
    required_permissions = ['admin_panel.change_integrationsettings', 'admin_panel.view_integrationsettings']

    def get(self, request):
        obj, _ = IntegrationSettings.objects.get_or_create()
        serializer = IntegrationSettingsSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj, _ = IntegrationSettings.objects.get_or_create()
        serializer = IntegrationSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)