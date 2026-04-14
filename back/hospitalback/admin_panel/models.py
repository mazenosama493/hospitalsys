from django.db import models

class AuditLog(models.Model):


    user = models.ForeignKey(
        'accounts.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_logs'
    )
    actions_choices = [
        ('login', 'Login'),
        ('status_change', 'Status Change'),
        ('permissions_change', 'Permissions Change'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('approval', 'Approval'),
        ('export', 'Export'),
        ('bulk_action', 'Bulk Action'),
    ]

    action = models.CharField(max_length=100, choices=actions_choices)

    resource = models.CharField(max_length=100)

    details = models.TextField(blank=True, null=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # 🔹 Severity
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]
    severity = models.CharField(
        max_length=10,
        choices=SEVERITY_CHOICES,
        default='info'
    )


    OUTCOME_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    outcome = models.CharField(
        max_length=10,
        choices=OUTCOME_CHOICES,
        default='success'
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.resource}"


    def get_number_of_logs_today(self):
        from django.utils import timezone
        today = timezone.now().date()
        return AuditLog.objects.filter(timestamp__date=today).count()
    
    class Meta:
        permissions = [
            ("export_auditlog", "Can export audit logs"),
        ]


class GeneralSettings(models.Model):
    hospital_name = models.CharField(max_length=255, default="MedHub Virtual Hospital")
    address = models.TextField(blank=True, null=True)
    timezone = models.CharField(max_length=100, default="UTC")
    date_format = models.CharField(max_length=50, default="YYYY-MM-DD")
    fiscal_year_start_month = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        if not self.pk and GeneralSettings.objects.exists():
            raise ValueError("Only one GeneralSettings instance allowed")
        super().save(*args, **kwargs)

    def __str__(self):
        return "General Settings"
    


class SecuritySettings(models.Model):
    auto_logout_minutes = models.PositiveIntegerField(default=60)
    max_login_attempts = models.PositiveIntegerField(default=3)
    min_password_length = models.PositiveIntegerField(default=8)
    enforce_2fa_for_admins = models.BooleanField(default=False)
    audit_log_retention_days = models.PositiveIntegerField(default=365)

    def save(self, *args, **kwargs):
        if not self.pk and SecuritySettings.objects.exists():
            raise ValueError("Only one SecuritySettings instance allowed")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Security Settings"
    



class NotificationSettings(models.Model):
    sms_for_critical = models.BooleanField(default=False)
    email_for_critical = models.BooleanField(default=True)
    daily_department_summary = models.BooleanField(default=False)
    appointment_reminder_hours = models.PositiveIntegerField(default=24)

    def save(self, *args, **kwargs):
        if not self.pk and NotificationSettings.objects.exists():
            raise ValueError("Only one NotificationSettings instance allowed")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Notification Settings"
    


class IntegrationSettings(models.Model):
    fhir_base_url = models.URLField(blank=True, null=True)
    pacs_server = models.CharField(max_length=255, blank=True, null=True)
    lab_middleware_ip = models.GenericIPAddressField(blank=True, null=True)
    enable_pharmacy_integration = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk and IntegrationSettings.objects.exists():
            raise ValueError("Only one IntegrationSettings instance allowed")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Integration Settings"