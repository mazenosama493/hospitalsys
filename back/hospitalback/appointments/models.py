import uuid
from django.db import models

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('accounts.User', on_delete=models.CASCADE)

    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=50)