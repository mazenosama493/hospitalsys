import uuid
from django.db import models

class Encounter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('accounts.User', on_delete=models.CASCADE)

    subjective = models.TextField()
    objective = models.TextField()
    assessment = models.TextField()
    plan = models.TextField()

    status = models.CharField(max_length=50)