from django.contrib import admin
from .models import AuditLog, SystemSetting

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'action']


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']