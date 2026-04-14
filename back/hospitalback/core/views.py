from rest_framework.viewsets import ModelViewSet
from .models import Department, Ward, Room, Bed
from .serializers import (
    DepartmentSerializer,
    WardSerializer,
    RoomSerializer,
    BedSerializer
)
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import HasUserPermission
from accounts.permissions import CustomDjangoModelPermissions,HasUserPermission
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.models import User
from patients.models import Patient
from django.db.models import Count
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class DepartmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter]

    filterset_fields = ['types']

    search_fields = ['name']


class WardViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = Ward.objects.all()
    serializer_class = WardSerializer


class RoomViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class BedViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = Bed.objects.all()
    serializer_class = BedSerializer

    filter_backends = [DjangoFilterBackend]

    filterset_fields = ['status', 'room__ward']



class BedStatsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]
    required_permissions = ['core.view_bed']

    def get(self, request):
        total_beds = Bed.objects.count()

        occupied = Bed.objects.filter(status='occupied').count()
        available = Bed.objects.filter(status='available').count()
        reserved = Bed.objects.filter(status='reserved').count()
        maintenance = Bed.objects.filter(status='maintenance').count()
        cleaning = Bed.objects.filter(status='cleaning').count()

        occupied_percent = (
            (occupied / total_beds) * 100 if total_beds > 0 else 0
        )

        return Response({
            "total_beds": total_beds,
            "occupied_beds": occupied,
            "available_beds": available,
            "reserved_beds": reserved,
            "maintenance_beds": maintenance,
            "cleaning_beds": cleaning,
            "occupied_percentage": round(occupied_percent, 2)
        })
    

class DepartmentCountView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]
    required_permissions = ['core.view_department']

    def get(self, request):
        count = Department.objects.count()
        return Response({
            "departments_count": count
        })
    


class DepartmentDashboardView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]
    required_permissions = ['core.view_department']

    def get(self, request):
        departments = Department.objects.select_related('head').all()

        data = []

        for dept in departments:
            staff_count = User.objects.filter(department=dept).count()

            patient_count = Patient.objects.filter(department=dept).count()

            data.append({
                "id": dept.id,
                "department": dept.name,
                "head": dept.head.get_full_name() if dept.head else None,
                "staff": staff_count,
                "patients": patient_count
            })

        return Response(data)