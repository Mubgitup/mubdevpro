from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
import datetime

@api_view(['GET'])
def health_check(request):
    """API health and status inspection endpoint."""
    db_engine = settings.DATABASES['default']['ENGINE'].split('.')[-1]
    return Response({
        'status': 'healthy',
        'service': 'Mubdev Backend API',
        'version': '1.0.0',
        'database_engine': db_engine,
        'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat()
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/contact/', include('contact.urls')),
]
