from django.contrib import admin
from .models import PharmacyPrescription

@admin.register(PharmacyPrescription)
class PharmacyPrescriptionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'medication', 'status']
    list_filter = ['status']
    search_fields = ['medication']