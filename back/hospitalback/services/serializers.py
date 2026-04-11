# services/serializers.py
from rest_framework import serializers
from .models import ServiceType, Service


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    service_type_name = serializers.CharField(source='service_type.name', read_only=True)

    class Meta:
        model = Service
        fields = '__all__'