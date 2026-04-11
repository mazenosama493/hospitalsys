from django.contrib import admin
from .models import Encounter

@admin.register(Encounter)
class EncounterAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'status']
    list_filter = ['status']
    search_fields = ['patient__first_name', 'doctor__email']