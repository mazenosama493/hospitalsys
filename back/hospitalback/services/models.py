from django.db import models
import uuid

class LabCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Hematology, Biochemistry...

    def __str__(self):
        return self.name


class LabTest(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # 🔹 Basic Info
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)

    # 🔹 Classification
    category = models.ForeignKey(
        LabCategory,
        on_delete=models.CASCADE,
        related_name='lab_tests',
        null=True,
        blank=True
    )

    # 🔹 Medical Info
    specimen = models.CharField(max_length=255, blank=True, null=True)  # Blood, Urine...
    tat_hours = models.PositiveIntegerField(help_text="Turnaround time in hours")

    # 🔹 Financial
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # 🔹 Authorization
    authorization_required = models.BooleanField(default=False)

    # 🔹 External Coding
    cpt_code = models.CharField(max_length=50, blank=True, null=True)

    # 🔹 Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)

    # 🔹 Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"
    



class RadiologyCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)  
    # Example: CT, MRI, X-Ray, Ultrasound

    def __str__(self):
        return self.name


class Radiology(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    CONTRAST_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # 🔹 Basic Info
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)

    # 🔹 Imaging Info
    modality = models.ForeignKey(
        RadiologyCategory,
        on_delete=models.CASCADE,
        related_name='radiology_tests',
        null=True,
        blank=True

    )  # CT, MRI, etc.

    body_part = models.CharField(max_length=100)  # Chest, Brain, Abdomen...

    contrast = models.CharField(
        max_length=20,
        choices=CONTRAST_CHOICES,
        default='none'
    )

    duration_minutes = models.PositiveIntegerField(
        help_text="Estimated duration in minutes"
    )

    # 🔹 Financial
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # 🔹 Authorization
    authorization_required = models.BooleanField(default=False)

    # 🔹 Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)

    # 🔹 Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"
    




class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Consultation, Procedure...

    def __str__(self):
        return self.name


class Service(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]

    UNIT_CHOICES = [
        ('session', 'Session'),
        ('procedure', 'Procedure'),
        ('hour', 'Hour'),
        ('day', 'Day'),
        ('unit', 'Unit'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # 🔹 Basic Info
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)

    # 🔹 Classification
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name='services',
        null=True,
        blank=True
    )

    department = models.ForeignKey(
        'core.Department',
        on_delete=models.SET_NULL,
        null=True,
        related_name='services'
    )

    # 🔹 Financial
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='unit')

    # 🔹 Coding
    cpt_code = models.CharField(max_length=50, blank=True, null=True)

    # 🔹 Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)

    # 🔹 Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


