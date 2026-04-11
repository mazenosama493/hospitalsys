import uuid
from django.db import models

class ImagingOrder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    status = models.CharField(max_length=50)


class RadiologyReport(models.Model):
    order = models.ForeignKey(ImagingOrder, on_delete=models.CASCADE)
    report = models.TextField()