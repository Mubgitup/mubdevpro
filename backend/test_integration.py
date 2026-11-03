import os
import sys
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mubdev_backend.settings')
django.setup()

from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status
from contact.models import ContactMessage

def run_tests():
    print("==================================================")
    print("MUBDEV BACKEND & API INTEGRATION TEST SUITE")
    print("==================================================")

    # 1. Django System Checks
    print("\n[1/5] Running Django system check...")
    call_command('check')
    print(">>> System check passed with zero issues.")

    client = APIClient()

    # 2. Health Check Endpoint
    print("\n[2/5] Testing /api/health/ endpoint...")
    res = client.get('/api/health/')
    assert res.status_code == status.HTTP_200_OK, f"Expected 200, got {res.status_code}"
    assert res.data['status'] == 'healthy', f"Expected status healthy, got {res.data['status']}"
    print(f">>> Health check OK: {res.data}")

    # 3. Valid Contact Submission
    print("\n[3/5] Testing valid contact submission to /api/contact/...")
    initial_count = ContactMessage.objects.count()
    valid_payload = {
        'name': 'Mubarek Test Visitor',
        'email': 'visitor@example.com',
        'subject': 'Inquiry regarding Full-Stack Development',
        'message': 'Hello Mubarek, testing the Django REST Framework and MySQL database integration.'
    }
    res = client.post('/api/contact/', valid_payload, format='json')
    assert res.status_code == status.HTTP_201_CREATED, f"Expected 201, got {res.status_code}: {res.data}"
    assert res.data['success'] is True
    assert ContactMessage.objects.count() == initial_count + 1
    new_msg = ContactMessage.objects.latest('created_at')
    assert new_msg.name == 'Mubarek Test Visitor'
    assert new_msg.email == 'visitor@example.com'
    print(f">>> Valid submission stored successfully! ID: {new_msg.id}, Table: {ContactMessage._meta.db_table}")

    # 4. Invalid Contact Submission
    print("\n[4/5] Testing invalid inputs (bad email, short message)...")
    invalid_payload = {
        'name': 'A',
        'email': 'invalid-email',
        'subject': 'Hi',
        'message': 'Short'
    }
    res = client.post('/api/contact/', invalid_payload, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST, f"Expected 400, got {res.status_code}"
    assert res.data['success'] is False
    assert 'email' in res.data['errors']
    assert 'message' in res.data['errors']
    print(f">>> Invalid submission rejected safely with field errors: {list(res.data['errors'].keys())}")

    # 5. Anti-Spam Honeypot Trapping
    print("\n[5/5] Testing anti-spam honeypot trapping...")
    spam_payload = valid_payload.copy()
    spam_payload['website'] = 'http://bot-spammer.com'
    res = client.post('/api/contact/', spam_payload, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert res.data['success'] is False
    print(">>> Anti-spam honeypot successfully rejected bot submission.")

    print("\n==================================================")
    print("ALL BACKEND & API TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(f"\nIntegration test failed: {e}")
        sys.exit(1)
