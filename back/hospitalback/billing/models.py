from django.db import models

class Invoice(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)

    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)


class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)