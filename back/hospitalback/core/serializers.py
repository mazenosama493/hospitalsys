from rest_framework import serializers
from .models import Department, Ward, Room, Bed


class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.get_full_name', read_only=True)

    class Meta:
        model = Department
        fields = [
            'id',
            'name',
            'head',
            'head_name',
            'phone',
            'location',
            'types',
            'status',
            'sub_name',
        ]


class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = '__all__'