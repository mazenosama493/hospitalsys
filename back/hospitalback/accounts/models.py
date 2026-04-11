import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    



class Permission(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.code

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    permissions = models.ManyToManyField(Permission, blank=True)
    def __str__(self):
        return self.display_name
    



class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)

    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    department = models.ForeignKey('core.Department', null=True, on_delete=models.SET_NULL)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()


    def get_permissions(self):
        if not self.role:
            return []
        return list(self.role.permissions.values_list("code", flat=True))

    def has_permission(self, perm_code):
        return perm_code in self.get_permissions()
    
    