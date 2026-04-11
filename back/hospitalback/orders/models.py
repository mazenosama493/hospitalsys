import uuid
from django.db import models

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('accounts.User', on_delete=models.CASCADE)

    category = models.CharField(max_length=50)
    status = models.CharField(max_length=50)