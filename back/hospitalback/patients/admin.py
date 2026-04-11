from django.contrib import admin
from .models import Patient, Admission

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['mrn', 'first_name', 'last_name', 'phone', 'status']
    search_fields = ['mrn', 'first_name', 'last_name', 'phone']
    list_filter = ['status', 'gender']


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'ward', 'bed', 'status', 'admission_date']
    list_filter = ['status', 'ward']