from django.apps import AppConfig


class BookingConfig(AppConfig):
    """Django app configuration for the booking application."""
    name = 'booking'
    verbose_name = 'Flight Booking'
    
    def ready(self):
        """Initialize app when Django starts."""
        try:
            import booking.signals  # noqa: F401
        except ImportError:
            pass
