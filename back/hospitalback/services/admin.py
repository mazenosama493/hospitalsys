from django.contrib import admin
from .models import (
    LabCategory,
    LabTest,
    Radiology,
    RadiologyCategory,
    ServiceCategory,
    Service
)


# 🔹 Lab Category
@admin.register(LabCategory)
class LabCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# 🔹 Radiology Category
@admin.register(RadiologyCategory)
class RadiologyCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# 🔹 Lab Tests
@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'category', 'price', 'status', 'is_active')
    list_filter = ('category', 'status', 'is_active')
    search_fields = ('name', 'code')


# 🔹 Radiology
@admin.register(Radiology)
class RadiologyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'modality', 'body_part', 'price', 'status', 'is_active')
    list_filter = ('modality', 'status', 'is_active')
    search_fields = ('name', 'code', 'body_part')


# 🔹 Service Category
@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# 🔹 Services
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'category', 'department', 'price', 'status', 'is_active')
    list_filter = ('category', 'department', 'status', 'is_active')
    search_fields = ('name', 'code', 'cpt_code')