import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)

class ContactSubmissionThrottle(AnonRateThrottle):
    # Limit anonymous submissions to 10 per hour per IP to prevent spam flood
    rate = '10/hour'

class ContactMessageCreateView(APIView):
    """
    API endpoint for handling verified visitor contact inquiries.
    POST: Validates input, sanitizes data, and stores record in the database.
    """
    throttle_classes = [ContactSubmissionThrottle]

    def get_client_ip(self, request):
        """Safely extract client IP from forward headers or remote address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def post(self, request, *args, **kwargs):
        serializer = ContactMessageSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    'success': False,
                    'message': 'Validation failed. Please correct the highlighted errors.',
                    'errors': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ip = self.get_client_ip(request)
            message_instance = serializer.save(ip_address=ip)

            logger.info("New contact message received from: %s (id: %s)", message_instance.email, message_instance.id)

            return Response(
                {
                    'success': True,
                    'message': 'Thank you! Your message has been safely received and stored in the database. Mubarek will review it and respond promptly.',
                    'data': {
                        'id': message_instance.id,
                        'name': message_instance.name,
                        'subject': message_instance.subject,
                        'created_at': message_instance.created_at.isoformat()
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error("Internal error saving contact message: %s", str(e), exc_info=True)
            # Return safe error without leaking internal server architecture
            return Response(
                {
                    'success': False,
                    'message': 'An unexpected error occurred while processing your message. Please try again later.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
