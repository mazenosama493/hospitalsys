from django.db import models

class Vital(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)

    systolic = models.IntegerField(null=True, blank=True)
    diastolic = models.IntegerField(null=True, blank=True)

    heart_rate = models.IntegerField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)


    @property
    def blood_pressure(self):
        return f"{self.systolic}/{self.diastolic}"