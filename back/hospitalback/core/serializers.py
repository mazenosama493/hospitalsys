from rest_framework import serializers
from core.models import Department, Bed, Ward, Room

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.get_full_name', read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'sub_name', 'types', 'status', 'phone', 'location', 'head', 'head_name']
        read_only_fields = ['id', 'head_name']

class BedListSerializer(serializers.ModelSerializer):
    room = serializers.CharField(source='room.name', read_only=True)
    ward = serializers.CharField(source='room.ward.name', read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)

    class Meta:
        model = Bed
        fields = ['id', 'number', 'status', 'room', 'ward', 'patient_name']

    

class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = ['id', 'name', 'department']




class RoomSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source='ward.name', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'ward', 'ward_name']