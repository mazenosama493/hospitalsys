# services/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import ServiceType, Service
from .serializers import ServiceTypeSerializer, ServiceSerializer
from accounts.permissions import IsAdminRole
from rest_framework.response import Response
from django.db.models import Count, Q




class ServiceTypeViewSet(ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = [ 'status', 'service_type']


class ServiceTypeCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = ServiceType.objects.annotate(
            active_services_count=Count(
                'services',
                filter=Q(services__is_active=True)
            )
        ).values('id', 'name', 'active_services_count')

        return Response(data)