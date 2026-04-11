from django.contrib import admin
from .models import User, Role, Permission

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name']
    search_fields = ['name']
    filter_horizontal = ['permissions']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'department', 'is_active']
    list_filter = ['role', 'department', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']


admin.site.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']    