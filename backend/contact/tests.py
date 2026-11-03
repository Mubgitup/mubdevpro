from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import ContactMessage

class ContactAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('contact:contact-submit')
        self.valid_payload = {
            'name': 'Amina Kidane',
            'email': 'amina.k@example.com',
            'subject': 'Software Engineering Inquiry',
            'message': 'Hello Mubarek, I saw your portfolio and would love to discuss a project collaboration.'
        }

    def test_valid_submission_creates_record(self):
        """Test submitting a valid contact message stores it in database and returns 201."""
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('data', response.data)
        self.assertEqual(ContactMessage.objects.count(), 1)

        msg = ContactMessage.objects.first()
        self.assertEqual(msg.name, 'Amina Kidane')
        self.assertEqual(msg.email, 'amina.k@example.com')
        self.assertEqual(msg.subject, 'Software Engineering Inquiry')

    def test_missing_required_fields(self):
        """Test submitting payload with missing fields returns 400 and validation errors."""
        invalid_payload = {
            'name': '',
            'email': '',
            'subject': '',
            'message': ''
        }
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('name', response.data['errors'])
        self.assertIn('email', response.data['errors'])

    def test_invalid_email_format(self):
        """Test invalid email format is rejected."""
        payload = self.valid_payload.copy()
        payload['email'] = 'not-an-email'
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['errors'])

    def test_message_too_short(self):
        """Test messages shorter than 10 characters are rejected."""
        payload = self.valid_payload.copy()
        payload['message'] = 'Hi!'
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data['errors'])

    def test_honeypot_spam_rejection(self):
        """Test that automated bots filling the hidden honeypot are rejected."""
        payload = self.valid_payload.copy()
        payload['website'] = 'http://spam-link.example.com'
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_health_check_endpoint(self):
        """Test health check endpoint returns 200 OK and valid status."""
        health_url = reverse('health-check')
        response = self.client.get(health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
