from django.http import HttpResponseForbidden
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class IPRestrictionMiddleware:
    """
    Middleware to restrict access based on IP addresses.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        client_ip = self.get_client_ip(request)

        # Skip IP restriction for auth endpoints
        if request.path.startswith('/api/auth/'):
            response = self.get_response(request)
            return response

        # Check blocked IPs
        blocked_ips = getattr(settings, 'BLOCKED_IPS', [])
        if client_ip in blocked_ips:
            logger.warning(f"Blocked IP {client_ip} attempted to access {request.path}")
            return HttpResponseForbidden("Access denied from your IP address.")

        # Check allowed IPs (if configured)
        allowed_ips = getattr(settings, 'ALLOWED_IPS', [])
        if allowed_ips and client_ip not in allowed_ips:
            logger.warning(f"IP {client_ip} not in allowed list attempted to access {request.path}")
            return HttpResponseForbidden("Access denied from your IP address.")

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class AuthenticationMiddleware:
    """
    Additional authentication checks middleware.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log authentication attempts
        if hasattr(request, 'user') and request.user.is_authenticated:
            logger.info(f"Authenticated user {request.user.username} accessing {request.path}")
        else:
            logger.info(f"Unauthenticated access to {request.path} from {self.get_client_ip(request)}")

        # Check for required headers in API requests
        if request.path.startswith('/api/'):
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if not auth_header and request.path not in ['/api/', '/api/register/', '/api/login/']:
                logger.warning(f"Missing authorization header for API access to {request.path}")

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
