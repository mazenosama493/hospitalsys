from django.urls import path
from .views import ActivePatientsCountView, PatientViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patients')

urlpatterns = [
    path('patients/active-count/', ActivePatientsCountView.as_view(), name='active-patients-count'),
]

urlpatterns += router.urls