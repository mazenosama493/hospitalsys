from django.urls import path, include
from accounts.views import (
    LoginView,
    CustomTokenRefreshView,
    LogoutView,
    UserViewSet,
    UserStatsView,
    GroupViewSet,
    GroupListViewSet,
    PermissionViewSet
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

router.register(r'groups', GroupViewSet, basename='groups')
router.register(r'groups-list', GroupListViewSet, basename='groups-list')
router.register(r'permissions', PermissionViewSet, basename='permissions')

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='token_logout'),
    path('api/user-stats/', UserStatsView.as_view(), name='user_stats'),

    path('', include(router.urls)),
]