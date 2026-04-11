import uuid
from django.db import models

class Specimen(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE)

    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)


class LabResult(models.Model):
    status_choices = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('in progress', 'In Progress'),
        ('cancelled', 'Cancelled'),
    ]
    specimen = models.ForeignKey(Specimen, on_delete=models.CASCADE)

    test_name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=status_choices, default='pending')


    def get_lab_in_progress_count(self):
        return LabResult.objects.filter(status='in progress').count()