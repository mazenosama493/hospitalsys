from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import LoginSerializer, UserSerializer, RoleSerializer, PermissionSerializer, RoleNameSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import HasUserPermission, IsAdminRole
from rest_framework import viewsets,filters
from .models import User, Role, Permission
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView



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
    permission_classes = [IsAuthenticated, HasUserPermission]


    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'role']
    search_fields = ['first_name', 'last_name', 'email', 'id']

    def get_required_permission(self):
        mapping = {
            'list': 'users_view',
            'retrieve': 'users_view',
            'create': 'users_create',
            'update': 'users_edit',
            'partial_update': 'users_edit',
            'destroy': 'users_delete'
        }
        return mapping.get(self.action, None)
    



class UserStatsView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermission]




    def get_required_permission(self):
        return "users_view"

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        suspended_users = total_users - active_users

        active_percentage = (active_users / total_users * 100) if total_users else 0

        return Response({
            "total_users": total_users,
            "active_percentage": round(active_percentage, 2),
            "suspended_users": suspended_users,
            "active_users": active_users
        })
    


class RoleListView(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminRole,IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id', 'name'] 


class PermissionViewSet(ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    permission_classes = [IsAdminRole,IsAuthenticated]
    serializer_class = PermissionSerializer


class RoleNameListView(ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleNameSerializer


