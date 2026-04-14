# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User
from core.models import Department
from django.contrib.auth.models import Group, Permission

class LoginSerializer(TokenObtainPairSerializer):
    group = serializers.CharField(write_only=True)

    def validate(self, attrs):
        group_name = attrs.pop('group', None)

        if not group_name:
            raise serializers.ValidationError({"group": "This field is required."})

        data = super().validate(attrs)
        user = self.user

        if not user.groups.filter(name=group_name).exists():
            raise serializers.ValidationError({
                "group": f"User does not belong to '{group_name}' group."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "account": "This account is inactive."
            })

        return data
    

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    email = serializers.EmailField(required=True)


    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        required=True
    )

    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )

    department_name = serializers.CharField(source='department.name', read_only=True)
    last_login = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'groups',
            'department',
            'department_name',
            'is_active',
            'first_name',
            'last_name',
            'password',
            'last_login',
        ]
        read_only_fields = ['id', 'last_login']

    def validate_email(self, value):
        if self.instance:
            if User.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Email is already in use.")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email is already in use.")
        return value

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        user.groups.set(groups)

        return user

    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if groups is not None:
            instance.groups.set(groups)

        return instance
    

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']
    

class GroupSerializer(serializers.ModelSerializer):
    permission_details = PermissionSerializer(
        source='permissions',
        many=True,
        read_only=True
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permission_details']
    


class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']




