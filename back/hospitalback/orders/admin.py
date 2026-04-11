from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'category', 'status']
    list_filter = ['category', 'status']