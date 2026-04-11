from django.urls import path, include
from accounts.views import (
    LoginView,
    CustomTokenRefreshView,
    LogoutView,
    UserViewSet,
    UserStatsView,
    RoleListView,
    PermissionViewSet,
    RoleNameListView
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleListView, basename='role')
router.register(r'permissions', PermissionViewSet, basename='permission')

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='token_logout'),
    path('api/user-stats/', UserStatsView.as_view(), name='user_stats'),
    path('roles/names/', RoleNameListView.as_view(), name='role-names'),

    path('', include(router.urls)),
]