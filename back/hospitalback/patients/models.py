import uuid
from django.db import models

class Patient(models.Model):
    status_choices = [
        ('active', 'Active'),
        ('discharged', 'Discharged'),
        ('deceased', 'Deceased'),
        ('inactive', 'Inactive'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mrn = models.CharField(max_length=50, unique=True)
    department = models.ForeignKey('core.Department', null=True, on_delete=models.SET_NULL, related_name='patients')

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)

    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()

    allergies = models.JSONField(default=list)
    status = models.CharField(max_length=50, choices=status_choices, default='active')


    def get_active_patients_count(self):
        return Patient.objects.filter(status='active').count()
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Admission(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    ward = models.ForeignKey('core.Ward', null=True, on_delete=models.SET_NULL)
    bed = models.ForeignKey('core.Bed', null=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=50)
    admission_date = models.DateTimeField()