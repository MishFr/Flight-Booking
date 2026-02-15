from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import CustomUser, Booking
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_approval_email_task(self, user_id):
    """
    Send an approval email to the user asynchronously.
    """
    try:
        user = CustomUser.objects.get(id=user_id)
        subject = 'Your Flight Booking Account Has Been Approved!'
        
        message = f'''Hi {user.username},

Welcome to Flight Booking System!

Your account has been approved and you can now log in to the system to start booking your flights.

Here's what you can do:
- Search for flights across multiple airlines
- Book and manage your flight reservations
- View your booking history
- Get exclusive special offers

Login now at: http://localhost:3000/login

If you have any questions, feel free to contact our support team.

Best regards,
The Flight Booking Team
'''
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flightbooking.com')
        recipient_list = [user.email]
        
        send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list,
            fail_silently=False
        )
        logger.info(f"Approval email sent to user {user_id}")
        return True
    except CustomUser.DoesNotExist:
        logger.error(f"User {user_id} not found for approval email")
        return False
    except Exception as exc:
        logger.error(f"Error sending approval email to user {user_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_rejection_email_task(self, user_id):
    """
    Send a rejection email to the user asynchronously.
    """
    try:
        user = CustomUser.objects.get(id=user_id)
        subject = 'Your Flight Booking Account Registration Update'
        
        message = f'''Hi {user.username},

Thank you for registering with Flight Booking System.

Unfortunately, your account registration has been rejected. This could be due to:
- Incomplete registration information
- Verification issues
- Policy restrictions

Please contact our support team for more information and to understand the next steps.

Support Email: support@flightbooking.com

Best regards,
The Flight Booking Team
'''
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flightbooking.com')
        recipient_list = [user.email]
        
        send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list,
            fail_silently=False
        )
        logger.info(f"Rejection email sent to user {user_id}")
        return True
    except CustomUser.DoesNotExist:
        logger.error(f"User {user_id} not found for rejection email")
        return False
    except Exception as exc:
        logger.error(f"Error sending rejection email to user {user_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_booking_confirmation_email(self, booking_id):
    """
    Send a booking confirmation email asynchronously.
    """
    try:
        booking = Booking.objects.select_related('user', 'flight').get(id=booking_id)
        user = booking.user
        flight = booking.flight
        
        subject = f'Booking Confirmed - {flight.flight_number}'
        
        message = f'''Hi {user.username},

Thank you for your booking!

Your flight has been successfully booked. Here are your booking details:

Booking ID: #{booking.id}
Flight Number: {flight.flight_number}
From: {flight.departure}
To: {flight.arrival}
Date: {flight.date.strftime('%Y-%m-%d %H:%M')}
Price: ${flight.price}
Payment Status: {booking.payment_status.upper()}

Important Information:
- Please arrive at the airport at least 2 hours before domestic flights
- Bring a valid photo ID and your booking confirmation
- Check baggage allowance with the airline

Manage your booking at: http://localhost:3000/bookings

Need to make changes? Contact our support team.

Best regards,
The Flight Booking Team
'''
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flightbooking.com')
        recipient_list = [user.email]
        
        send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list,
            fail_silently=False
        )
        logger.info(f"Booking confirmation email sent for booking {booking_id}")
        return True
    except Booking.DoesNotExist:
        logger.error(f"Booking {booking_id} not found for confirmation email")
        return False
    except Exception as exc:
        logger.error(f"Error sending booking confirmation email for {booking_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_booking_cancellation_email(self, booking_id):
    """
    Send a booking cancellation email asynchronously.
    """
    try:
        booking = Booking.objects.select_related('user', 'flight').get(id=booking_id)
        user = booking.user
        flight = booking.flight
        
        subject = f'Booking Cancelled - {flight.flight_number}'
        
        message = f'''Hi {user.username},

Your booking has been cancelled as requested.

Booking Details:
Booking ID: #{booking.id}
Flight Number: {flight.flight_number}
From: {flight.departure}
To: {flight.arrival}
Date: {flight.date.strftime('%Y-%m-%d %H:%M')}

If you did not request this cancellation, please contact our support team immediately.

Refund Information:
- Refunds will be processed within 5-7 business days
- The refund will be credited to your original payment method

For any queries, contact our support team.

Best regards,
The Flight Booking Team
'''
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flightbooking.com')
        recipient_list = [user.email]
        
        send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list,
            fail_silently=False
        )
        logger.info(f"Cancellation email sent for booking {booking_id}")
        return True
    except Booking.DoesNotExist:
        logger.error(f"Booking {booking_id} not found for cancellation email")
        return False
    except Exception as exc:
        logger.error(f"Error sending cancellation email for {booking_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_registration_email(self, user_id):
    """
    Send a registration confirmation email asynchronously.
    """
    try:
        user = CustomUser.objects.get(id=user_id)
        subject = 'Welcome to Flight Booking System - Confirm Your Account'
        
        message = f'''Hi {user.username},

Thank you for registering with Flight Booking System!

Your account is currently pending approval from our administrators. 
You will receive another email once your account has been approved.

In the meantime, you can:
- Explore our flight search features
- Browse special offers
- Learn about travel destinations

Once approved, you'll be able to:
- Search and book flights
- Manage your reservations
- Track flight status
- Get exclusive deals

Expected approval time: Within 24 hours

Best regards,
The Flight Booking Team
'''
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flightbooking.com')
        recipient_list = [user.email]
        
        send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list,
            fail_silently=False
        )
        logger.info(f"Registration email sent to user {user_id}")
        return True
    except CustomUser.DoesNotExist:
        logger.error(f"User {user_id} not found for registration email")
        return False
    except Exception as exc:
        logger.error(f"Error sending registration email to user {user_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)
