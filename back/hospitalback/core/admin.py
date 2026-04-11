from django.contrib import admin
from .models import Department, Ward, Bed, Room

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ['name', 'department']
    list_filter = ['department']
    search_fields = ['name']


@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ['id', 'room','room__ward','status']
    list_filter = ['status', 'room']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'ward', 'ward__department']
    list_filter = ['ward', 'ward__department']
