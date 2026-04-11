import uuid
from django.db import models

class PharmacyPrescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    medication = models.CharField(max_length=255)
    status = models.CharField(max_length=50)