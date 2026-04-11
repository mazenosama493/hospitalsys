from django.contrib import admin
from .models import Invoice, Payment

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['patient', 'total', 'status']
    list_filter = ['status']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['invoice', 'amount']