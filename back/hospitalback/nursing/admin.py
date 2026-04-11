from django.contrib import admin
from .models import Vital

@admin.register(Vital)
class VitalAdmin(admin.ModelAdmin):
    list_display = ['patient', 'heart_rate', 'temperature', 'timestamp']
    list_filter = ['timestamp']