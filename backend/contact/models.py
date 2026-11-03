from django.db import models
from django.core.validators import MinLengthValidator

class ContactMessage(models.Model):
    """
    Model representing contact form submissions from visitors.
    Stores validated user communication in MySQL.
    """
    name = models.CharField(
        max_length=120,
        validators=[MinLengthValidator(2, message="Name must be at least 2 characters.")],
        help_text="Full name of the sender."
    )
    email = models.EmailField(
        max_length=254,
        db_index=True,
        help_text="Contact email address of the sender."
    )
    subject = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(3, message="Subject must be at least 3 characters.")],
        help_text="Subject line of the inquiry."
    )
    message = models.TextField(
        validators=[MinLengthValidator(10, message="Message must be at least 10 characters.")],
        help_text="Content of the inquiry."
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of the submitter for rate-limiting & spam prevention."
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Mark whether Mubarek has reviewed this message."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when message was submitted."
    )

    class Meta:
        db_table = 'mubdev_contact_messages'
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
        indexes = [
            models.Index(fields=['-created_at'], name='contact_created_idx'),
            models.Index(fields=['email'], name='contact_email_idx'),
        ]

    def __str__(self):
        return f"{self.name} — {self.subject} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
