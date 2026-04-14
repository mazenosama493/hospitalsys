from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    WardViewSet,
    RoomViewSet,
    BedViewSet,
    BedStatsView,
    DepartmentCountView,
    DepartmentDashboardView
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'wards', WardViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'beds', BedViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('beds-stats/', BedStatsView.as_view(), name='bed-stats'),
    path('departments-count/', DepartmentCountView.as_view(), name='departments-count'),
    path('departments-dashboard/', DepartmentDashboardView.as_view(), name='departments-dashboard'),
]