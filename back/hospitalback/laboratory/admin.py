from django.contrib import admin
from .models import Specimen, LabResult

@admin.register(Specimen)
class SpecimenAdmin(admin.ModelAdmin):
    list_display = ['patient', 'type', 'status']
    list_filter = ['status', 'type']


@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ['specimen', 'test_name', 'value', 'unit']
    search_fields = ['test_name']