from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import LoginSerializer, UserSerializer, GroupSerializer, GroupListSerializer, PermissionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import HasUserPermission, IsAdminRole, CustomDjangoModelPermissions
from rest_framework import viewsets,filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView

from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django.contrib.auth.models import Group, Permission
from .models import User



class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class CustomTokenRefreshView(TokenRefreshView):
    pass


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        




class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]


    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active','groups__id']
    search_fields = ['first_name', 'last_name', 'email', 'id']



class UserStatsView(APIView):
    permission_classes = [IsAuthenticated,HasUserPermission]

    required_permissions = ['accounts.view_user']

    def get(self, request):
        total_users = User.objects.filter(groups__isnull=False).distinct().count()
        active_users = User.objects.filter(is_active=True,groups__isnull=False).distinct().count()
        suspended_users = total_users - active_users

        active_percentage = (active_users / total_users * 100) if total_users else 0

        return Response({
            "total_users": total_users,
            "active_percentage": round(active_percentage, 2),
            "suspended_users": suspended_users,
            "active_users": active_users
        })
    


class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']



class GroupListViewSet(ReadOnlyModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupListSerializer



class PermissionViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, CustomDjangoModelPermissions]
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer



