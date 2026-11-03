import re
import html
from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for validating, sanitizing, and persisting contact messages.
    Includes anti-spam honeypot verification.
    """
    # Anti-spam honeypot field (hidden in UI; bots often fill this)
    website = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        help_text="Spam protection honeypot. Must remain empty."
    )

    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'website', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        cleaned = html.escape(value.strip())
        if len(cleaned) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(cleaned) > 120:
            raise serializers.ValidationError("Name cannot exceed 120 characters.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(pattern, cleaned):
            raise serializers.ValidationError("Please provide a valid email address.")
        return cleaned

    def validate_subject(self, value):
        cleaned = html.escape(value.strip())
        if len(cleaned) < 3:
            raise serializers.ValidationError("Subject must be at least 3 characters long.")
        if len(cleaned) > 200:
            raise serializers.ValidationError("Subject cannot exceed 200 characters.")
        return cleaned

    def validate_message(self, value):
        cleaned = html.escape(value.strip())
        if len(cleaned) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return cleaned

    def validate(self, attrs):
        # Honeypot verification: reject if a bot filled the honeypot
        honeypot = attrs.pop('website', '')
        if honeypot:
            raise serializers.ValidationError({"spam": "Automated submission detected."})
        return attrs
