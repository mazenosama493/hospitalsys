# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User, Role, Permission
from core.models import Department

class LoginSerializer(TokenObtainPairSerializer):
    role = serializers.CharField(write_only=True)

    def validate(self, attrs):
        role_name = attrs.pop('role', None)
        if not role_name:
            raise serializers.ValidationError({"role": "This field is required."})

        data = super().validate(attrs)
        user = self.user

        if not user.role or user.role.name != role_name:
            raise serializers.ValidationError({
                "role": f"User does not have the required role '{role_name}'."
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                "account": "This account is inactive."
            })

        return data
    

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    email = serializers.EmailField(required=True)
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), required=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False, allow_null=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    last_login = serializers.DateTimeField(read_only=True)


    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'department', 'department_name', 'is_active', 'first_name', 'last_name', 'password', 'last_login']
        read_only_fields = ['id', 'last_login']

    def validate_email(self, value):
        if self.instance:
            # For updates, exclude current instance
            if User.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Email is already in use.")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    



class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'code']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'display_name', 'permissions']


class RoleNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['name']