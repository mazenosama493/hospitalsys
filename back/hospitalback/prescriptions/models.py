from django.db import models

class Prescription(models.Model):
    patient = models.ForeignKey("patients.Patient", on_delete=models.CASCADE)
    doctor = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

    medication = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)

    status = models.CharField(max_length=20)
