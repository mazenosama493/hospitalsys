from rest_framework.permissions import BasePermission

class HasUserPermission(BasePermission):

    def has_permission(self, request, view):
        required_perm = getattr(view, 'get_required_permission', lambda: None)()
        if not required_perm:
            return True
        return request.user.is_authenticated and request.user.has_permission(required_perm)
    


class IsAdminRole(BasePermission):
    message = "You must be an admin to access this."

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated or not getattr(user, 'role', None):
            return False
        return user.role.name.lower() == 'admin'