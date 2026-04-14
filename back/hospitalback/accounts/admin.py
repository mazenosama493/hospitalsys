from django.contrib import admin
from .models import User



@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'department', 'is_active']
    list_filter = [ 'department', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
