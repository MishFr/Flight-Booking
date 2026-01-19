from django.conf import settings

def send_approval_email(user):
    """
    Send an approval email to the user.
    """
    subject = 'Your account has been approved'
    message = f'Hi {user.username},\n\nYour account has been approved. You can now log in to the system.'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
    send_mail(subject, message, from_email, recipient_list)
=======
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser

@shared_task
def send_approval_email_task(user_id):
    """
    Send an approval email to the user asynchronously.
    """
    try:
        user = CustomUser.objects.get(id=user_id)
        subject = 'Your account has been approved'
        message = f'Hi {user.username},\n\nYour account has been approved. You can now log in to the system.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        send_mail(subject, message, from_email, recipient_list)
    except CustomUser.DoesNotExist:
        pass  # User might have been deleted
