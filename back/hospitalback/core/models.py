import uuid
from django.db import models

class Department(models.Model):
    status_choices = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    types_choises = [('clinical', 'Clinical'),
       ('diagnostic', 'Diagnostic'),
       ('support', 'Support'),
       ('administrative', 'Administrative'),
       ('surgical', 'Surgical'),
       ('emergency', 'Emergency'),
       ('pharmacy', 'Pharmacy'),]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    head = models.ForeignKey(
        'accounts.User', 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='managed_department'
    )

    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    types = models.CharField(max_length=50,blank=True, null=True, choices=types_choises)
    status=models.CharField(max_length=50, choices=status_choices, default='active')
    sub_name = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self):
        return self.name
    


class Ward(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,related_name='wards')




class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE, related_name='rooms')

    def __str__(self):
        return self.name


class Bed(models.Model):
    status_choices = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('maintenance', 'Maintenance'),
        ('cleaning', 'Cleaning'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField(max_length=20, blank=True, null=True)
    room=models.ForeignKey(Room, on_delete=models.CASCADE, related_name='beds', null=True)
    patient = models.OneToOneField('patients.Patient', on_delete=models.SET_NULL, null=True, blank=True, related_name='beds')  
    status = models.CharField(max_length=50, choices=status_choices, default='available')

    