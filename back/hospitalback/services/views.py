from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from accounts.permissions import CustomDjangoModelPermissions,HasUserPermission

from .models import (
    LabCategory,
    LabTest,
    Radiology,
    ServiceCategory,
    Service
)

from .serializers import (
    LabCategorySerializer,
    LabTestSerializer,
    RadiologySerializer,
    ServiceCategorySerializer,
    ServiceSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response


# 🔹 Lab
class LabCategoryViewSet(ModelViewSet):
    queryset = LabCategory.objects.all()
    serializer_class = LabCategorySerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]


class LabTestViewSet(ModelViewSet):
    queryset = LabTest.objects.select_related('category').all()
    serializer_class = LabTestSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'status', 'is_active']
    search_fields = ['name', 'code']


# 🔹 Radiology
class RadiologyViewSet(ModelViewSet):
    queryset = Radiology.objects.all()
    serializer_class = RadiologySerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['modality', 'status', 'is_active']
    search_fields = ['name', 'code', 'body_part']


# 🔹 Services
class ServiceCategoryViewSet(ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.select_related('category', 'department').all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'department', 'status', 'is_active']
    search_fields = ['name', 'code', 'cpt_code']




class ActiveServicesStatsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]
    required_permissions = ['services.view_service', 'services.view_labtest', 'services.view_radiology']

    def get(self, request):
        lab_active = LabTest.objects.filter(is_active=True).count()
        radiology_active = Radiology.objects.filter(is_active=True).count()
        services_active = Service.objects.filter(is_active=True).count()

        return Response({
            "active_lab_tests": lab_active,
            "active_radiology": radiology_active,
            "active_services": services_active,
            "total_active_all": lab_active + radiology_active + services_active
        })