from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AuditLogViewSet
from .views import (
    GeneralSettingsView,
    SecuritySettingsView,   
    NotificationSettingsView,
    IntegrationSettingsView
)

router = DefaultRouter()
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')

urlpatterns = [
    path('', include(router.urls)), 
    path('settings/general/', GeneralSettingsView.as_view()),
    path('settings/security/', SecuritySettingsView.as_view()),
    path('settings/notifications/', NotificationSettingsView.as_view()),
    path('settings/integrations/', IntegrationSettingsView.as_view()),
]