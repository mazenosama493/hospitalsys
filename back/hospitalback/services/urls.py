# services/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ServiceTypeViewSet, ServiceViewSet, ServiceTypeCountView

router = DefaultRouter()
router.register('service-types', ServiceTypeViewSet)
router.register('services', ServiceViewSet)

urlpatterns = [
    path('service-types-count/', ServiceTypeCountView.as_view()),
]

urlpatterns += router.urls