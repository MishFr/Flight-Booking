from rest_framework.permissions import BasePermission
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class IsApprovedUser(BasePermission):
    """
    Custom permission to only allow access to approved users.
    """
    message = 'Your account is pending approval. Please wait for admin approval.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.status == 'approved'


class IsAdminOrApprovedUser(BasePermission):
    """
    Custom permission to allow access to admin users or approved regular users.
    """
    message = 'Access denied. Admin privileges or approved account required.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.status == 'approved'


class IPAddressPermission(BasePermission):
    """
    Custom permission to restrict access based on IP addresses.
    """
    message = 'Access denied from your IP address.'

    def has_permission(self, request, view):
        client_ip = self.get_client_ip(request)

        # Check blocked IPs
        blocked_ips = getattr(settings, 'BLOCKED_IPS', [])
        if client_ip in blocked_ips:
            logger.warning(f"Blocked IP {client_ip} attempted to access {request.path}")
            return False

        # Check allowed IPs (if configured)
        allowed_ips = getattr(settings, 'ALLOWED_IPS', [])
        if allowed_ips and client_ip not in allowed_ips:
            logger.warning(f"IP {client_ip} not in allowed list attempted to access {request.path}")
            return False

        return True

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BookingRateLimitPermission(BasePermission):
    """
    Custom permission that includes additional booking-specific rate limiting.
    """
    message = 'Booking rate limit exceeded. Please try again later.'

    def has_permission(self, request, view):
        # This permission can be extended with additional booking logic
        # For now, it just allows access - rate limiting is handled by throttle classes
        return True


class FlightSearchThrottle(AnonRateThrottle):
    """
    Custom throttle for flight search endpoints.
    """
    scope = 'flight_search'


class BookingThrottle(UserRateThrottle):
    """
    Custom throttle for booking creation endpoints.
    """
    scope = 'booking'


class AdminThrottle(UserRateThrottle):
    """
    Custom throttle for admin endpoints.
    """
    scope = 'admin'
