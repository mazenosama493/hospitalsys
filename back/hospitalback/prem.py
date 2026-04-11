import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospitalback.settings')
django.setup()

from accounts.models import Permission

RESOURCES = [
    "Patients", "Encounters", "Orders", "Prescriptions", "Lab Results", 
    "Radiology Reports", "Invoices", "Claims", "Payments", "Users", 
    "Departments", "Beds", "Catalogs", "Audit Logs", "Settings"
]

ACTIONS = ["view", "create", "edit", "delete", "approve", "export"]

def run():
    print("🚀 Starting permission generation...")
    created_count = 0

    for resource in RESOURCES:
        for action in ACTIONS:
            perm_code = f"{action}_{resource.lower().replace(' ', '_')}"
            perm_name = f"Can {action.title()} {resource}"

            _, created = Permission.objects.get_or_create(
                code=perm_code,
                defaults={'name': perm_name}
            )

            if created:
                created_count += 1

    print(f"✅ Created {created_count} new permissions")
    print(f"📊 Total matrix size: {len(RESOURCES) * len(ACTIONS)}")


if __name__ == '__main__':
    run()