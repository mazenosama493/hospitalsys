from rest_framework import serializers
from .models import AuditLog, NotificationSettings , GeneralSettings ,SecuritySettings,IntegrationSettings


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']





class GeneralSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSettings
        fields = '__all__'


class SecuritySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecuritySettings
        fields = '__all__'


class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = '__all__'


class IntegrationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrationSettings
        fields = '__all__'




