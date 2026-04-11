from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from accounts.permissions import HasUserPermission, IsAdminRole
from core.models import Bed, Department,Ward, Room
from accounts.models import User
from patients.models import Patient
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .serializers import DepartmentSerializer, BedListSerializer, WardSerializer,RoomSerializer
from rest_framework import viewsets

class BedStatsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]

    def get_required_permission(self):
        return "beds_view"

    def get(self, request):
        total_beds = Bed.objects.count()

        status_counts = Bed.objects.values('status').annotate(count=Count('status'))

        counts = {
            'available': 0,
            'occupied': 0,
            'reserved': 0,
            'maintenance': 0,
            'cleaning': 0
        }

        for item in status_counts:
            counts[item['status']] = item['count']

        occupied = counts['occupied']
        occupancy_percentage = (occupied / total_beds * 100) if total_beds else 0

        return Response({
            "total_beds": total_beds,
            "available": counts['available'],
            "occupied": counts['occupied'],
            "reserved": counts['reserved'],
            "maintenance": counts['maintenance'],
            "cleaning": counts['cleaning'],
            "occupancy_percentage": round(occupancy_percentage, 2)
        })
    



class DepartmentStatsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]

    def get_required_permission(self):
        return "departments_view"

    def get(self, request):
        departments = Department.objects.all()

        data = []

        for dept in departments:
            users_count = User.objects.filter(department=dept).count()
            patients_count = Patient.objects.filter(department=dept).count()

            data.append({
                "id": dept.id,
                "name": dept.name,
                "head": dept.head.email if dept.head else None,
                "users_count": users_count,
                "patients_count": patients_count
            })

        return Response(data)
    


class DepartmentListView(ListAPIView):
    queryset = Department.objects.all()
    permission_classes = [IsAuthenticated, HasUserPermission]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['types']

    def get_required_permission(self):
        return "departments_view"

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).annotate(
            users_count=Count('user', distinct=True),
            patients_count=Count('patients', distinct=True),
            total_beds=Count('wards__rooms__beds', distinct=True),
            occupied_beds=Count(
                'wards__rooms__beds',
                filter=Q(wards__rooms__beds__status='occupied'),
                distinct=True
            )
        )

        return Response([
            {
                "id": dept.id,
                "name": dept.name,
                "sub_name": dept.sub_name,
                "type": dept.types,
                "status": dept.status,
                "head": f"{dept.head.first_name} {dept.head.last_name}" if dept.head else None,
                "users_count": dept.users_count,
                "patients_count": dept.patients_count,
                "total_beds": dept.total_beds,
                "occupied_beds": dept.occupied_beds,
                "occupancy_percentage": round(
                    (dept.occupied_beds / dept.total_beds * 100)
                    if dept.total_beds else 0, 2
                ),
                "location": dept.location,
                "phone": dept.phone,
            }
            for dept in queryset
        ])
    




class DepartmentPermissionMixin:
    def get_required_permission(self):
        mapping = {
            'list': 'departments_view',
            'retrieve': 'departments_view',
            'create': 'departments_create',
            'update': 'departments_edit',
            'partial_update': 'departments_edit',
            'destroy': 'departments_delete'
        }
        return mapping.get(self.action, None)
    
class BedpermissionMixin:
    def get_required_permission(self):
        mapping = {
            'list': 'beds_view',
            'retrieve': 'beds_view',
            'create': 'beds_create',
            'update': 'beds_edit',
            'partial_update': 'beds_edit',
            'destroy': 'beds_delete'
        }
        return mapping.get(self.action, None)
    



class DepartmentViewSet(viewsets.ModelViewSet, DepartmentPermissionMixin):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, HasUserPermission]

    # Filters by type or status
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['types', 'status']

    def get_required_permission(self):
        return super().get_required_permission()
    







class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    permission_classes = [IsAuthenticated,IsAdminRole]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department']

    basename = "wards"




class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.select_related('ward')
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ward']

    basename = "rooms"



class BedViewSet(viewsets.ModelViewSet, BedpermissionMixin):
    queryset = Bed.objects.select_related('room__ward', 'patient')
    serializer_class = BedListSerializer
    permission_classes = [IsAuthenticated, HasUserPermission]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'room__ward']

    basename = "beds"
