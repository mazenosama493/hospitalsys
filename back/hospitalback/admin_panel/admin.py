from django.contrib import admin
from .models import AuditLog, NotificationSettings , GeneralSettings ,SecuritySettings,IntegrationSettings
@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'action']

@admin.register(GeneralSettings)
class GeneralSettingsAdmin(admin.ModelAdmin):
    pass

@admin.register(SecuritySettings)
class SecuritySettingsAdmin(admin.ModelAdmin):
    pass

@admin.register(NotificationSettings)
class NotificationSettingsAdmin(admin.ModelAdmin):
    pass

@admin.register(IntegrationSettings)
class IntegrationSettingsAdmin(admin.ModelAdmin):
    pass
