from django.urls import path
from core.views import BedStatsView, DepartmentStatsView, DepartmentListView, DepartmentViewSet, WardViewSet, RoomViewSet,BedViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'wards', WardViewSet, basename='wards')
router.register(r'rooms', RoomViewSet, basename='rooms')
router.register(r'beds', BedViewSet, basename='beds')
urlpatterns = [
    path('beds/stats/', BedStatsView.as_view(), name='bed-stats'),
    path('departments/stats/', DepartmentStatsView.as_view(), name='department-stats'),
    path('departments/view/', DepartmentListView.as_view(), name='department-list'),
]
urlpatterns += router.urls
