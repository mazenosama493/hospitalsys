from rest_framework import serializers
from .models import (
    LabCategory,
    LabTest,
    Radiology,
    ServiceCategory,
    Service
)


# 🔹 Lab
class LabCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LabCategory
        fields = '__all__'


class LabTestSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = LabTest
        fields = '__all__'


# 🔹 Radiology
class RadiologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Radiology
        fields = '__all__'


# 🔹 Services
class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Service
        fields = '__all__'