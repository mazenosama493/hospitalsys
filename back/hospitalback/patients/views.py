from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from accounts.permissions import HasUserPermission, CustomDjangoModelPermissions
from rest_framework.viewsets import ModelViewSet
from .serializers import PatientSerializer



class ActivePatientsCountView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]

    required_permissions = ['patients.view_patient']

    def get(self, request):
        count = Patient.objects.filter(status='active').count()
        return Response({
            "active_patients": count
        })
    


class PatientViewSet(ModelViewSet):
    queryset = Patient.objects.select_related('department').all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]