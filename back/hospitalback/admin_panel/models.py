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


class SystemSetting(models.Model):
    key = models.CharField(max_length=100)
    value = models.TextField()