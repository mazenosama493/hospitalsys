from rest_framework.permissions import BasePermission

class HasUserPermission(BasePermission):

    def has_permission(self, request, view):
        required_perms = getattr(view, 'required_permissions', [])

        if not required_perms:
            return True

        return all(request.user.has_perm(perm) for perm in required_perms)
    


class IsAdminRole(BasePermission):
    message = "You must be an admin to access this."

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated or not getattr(user, 'role', None):
            return False
        return user.role.name.lower() == 'admin'
    



from rest_framework.permissions import DjangoModelPermissions


class CustomDjangoModelPermissions(DjangoModelPermissions):
    def __init__(self):
        self.perms_map = {
            'GET': ['%(app_label)s.view_%(model_name)s'],
            'OPTIONS': [],
            'HEAD': [],
            'POST': ['%(app_label)s.add_%(model_name)s'],
            'PUT': ['%(app_label)s.change_%(model_name)s'],
            'PATCH': ['%(app_label)s.change_%(model_name)s'],
            'DELETE': ['%(app_label)s.delete_%(model_name)s'],
        }