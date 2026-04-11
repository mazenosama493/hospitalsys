from django.contrib import admin
from .models import Service, ServiceType


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'service_type', 'status')
    list_filter = ('service_type', 'status')
    search_fields = ('name',)

@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
