from django.db import models

class ServiceType(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Lab Test, Radiology...
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    



class Service(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)

    status_choices = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    service_type = models.ForeignKey(
        ServiceType,
        on_delete=models.CASCADE,
        related_name='services'
    )

    specimen = models.CharField(max_length=255, blank=True, null=True)
    tat_hours = models.PositiveIntegerField(help_text="Turnaround time in hours")

    price = models.DecimalField(max_digits=10, decimal_places=2)

    authorization_required = models.BooleanField(default=False)

    cpt_code = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=status_choices, default='active')

    def __str__(self):
        return self.name
    


