from django.contrib import admin
from .models import ImagingOrder, RadiologyReport

@admin.register(ImagingOrder)
class ImagingOrderAdmin(admin.ModelAdmin):
    list_display = ['patient', 'status']
    list_filter = ['status']


@admin.register(RadiologyReport)
class RadiologyReportAdmin(admin.ModelAdmin):
    list_display = ['order']