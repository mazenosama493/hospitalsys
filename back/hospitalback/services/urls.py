from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    LabCategoryViewSet,
    LabTestViewSet,
    RadiologyViewSet,
    ServiceCategoryViewSet,
    ServiceViewSet,
    ActiveServicesStatsView
)

router = DefaultRouter()

# Lab
router.register(r'lab-categories', LabCategoryViewSet)
router.register(r'lab-tests', LabTestViewSet)

# Radiology
router.register(r'radiology', RadiologyViewSet)

# Services
router.register(r'service-categories', ServiceCategoryViewSet)
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
     path('dashboard/active-services/', ActiveServicesStatsView.as_view(), name='active-services-stats'),
]