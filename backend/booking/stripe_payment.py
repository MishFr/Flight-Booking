"""
Stripe Payment Integration for Flight Booking System

This module provides Stripe payment functionality for the flight booking application.
"""

import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Booking, Flight
from .tasks import send_booking_confirmation_email
import logging

logger = logging.getLogger(__name__)

# Configure Stripe with the secret key from settings
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)


class CreatePaymentIntentView(APIView):
    """
    Create a Stripe Payment Intent for flight booking.
    
    POST /api/payments/create-intent/
    Body: {
        "booking_id": 1,
        "amount": 500.00  # Amount in USD
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            booking_id = request.data.get('booking_id')
            amount = request.data.get('amount')

            if not booking_id or not amount:
                return Response(
                    {'error': 'booking_id and amount are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the booking
            try:
                booking = Booking.objects.get(id=booking_id, user=request.user)
            except Booking.DoesNotExist:
                return Response(
                    {'error': 'Booking not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Convert amount to cents (Stripe uses smallest currency unit)
            amount_cents = int(float(amount) * 100)

            # Create a payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                metadata={
                    'booking_id': str(booking_id),
                    'user_id': str(request.user.id),
                    'flight_number': booking.flight.flight_number
                },
                description=f'Flight booking for {booking.flight.flight_number}'
            )

            return Response({
                'client_secret': payment_intent.client_secret,
                'payment_intent_id': payment_intent.id,
                'amount': amount,
                'currency': 'usd'
            })

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            return Response(
                {'error': f'Payment error: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating payment intent: {e}")
            return Response(
                {'error': 'An error occurred while creating the payment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentIntentConfirmView(APIView):
    """
    Confirm a Stripe Payment Intent after payment is processed.
    
    POST /api/payments/confirm/
    Body: {
        "payment_intent_id": "pi_xxx",
        "booking_id": 1
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            payment_intent_id = request.data.get('payment_intent_id')
            booking_id = request.data.get('booking_id')

            if not payment_intent_id or not booking_id:
                return Response(
                    {'error': 'payment_intent_id and booking_id are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve the payment intent from Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

            if payment_intent.status == 'succeeded':
                # Update the booking status
                try:
                    booking = Booking.objects.get(id=booking_id, user=request.user)
                    booking.payment_status = 'paid'
                    booking.status = 'confirmed'
                    booking.save()

                    # Send confirmation email asynchronously
                    send_booking_confirmation_email.delay(booking.id)

                    return Response({
                        'message': 'Payment successful',
                        'booking': {
                            'id': booking.id,
                            'status': booking.status,
                            'payment_status': booking.payment_status
                        }
                    })
                except Booking.DoesNotExist:
                    return Response(
                        {'error': 'Booking not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                return Response(
                    {'error': f'Payment not completed. Status: {payment_intent.status}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            return Response(
                {'error': f'Payment error: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error confirming payment: {e}")
            return Response(
                {'error': 'An error occurred while confirming the payment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StripeWebhookView(APIView):
    """
    Handle Stripe webhooks for payment events.
    
    POST /api/payments/webhook/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)

        try:
            if webhook_secret and sig_header:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
            else:
                # For development/testing without signature verification
                import json
                event = json.loads(payload)

            # Handle the event
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                booking_id = payment_intent.get('metadata', {}).get('booking_id')
                
                if booking_id:
                    try:
                        booking = Booking.objects.get(id=int(booking_id))
                        booking.payment_status = 'paid'
                        booking.status = 'confirmed'
                        booking.save()
                        
                        # Send confirmation email
                        send_booking_confirmation_email.delay(booking.id)
                        
                        logger.info(f"Booking {booking_id} payment confirmed via webhook")
                    except Booking.DoesNotExist:
                        logger.error(f"Booking {booking_id} not found for webhook")

            elif event['type'] == 'payment_intent.payment_failed':
                payment_intent = event['data']['object']
                booking_id = payment_intent.get('metadata', {}).get('booking_id')
                
                if booking_id:
                    try:
                        booking = Booking.objects.get(id=int(booking_id))
                        booking.payment_status = 'failed'
                        booking.save()
                        logger.info(f"Booking {booking_id} payment failed via webhook")
                    except Booking.DoesNotExist:
                        logger.error(f"Booking {booking_id} not found for webhook")

            return Response({'status': 'success'})

        except ValueError as e:
            # Invalid payload
            logger.error(f"Invalid payload in webhook: {e}")
            return Response(
                {'error': 'Invalid payload'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            logger.error(f"Invalid signature in webhook: {e}")
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error processing webhook: {e}")
            return Response(
                {'error': 'Webhook processing error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetPublishableKeyView(APIView):
    """
    Get the Stripe publishable key for the frontend.
    
    GET /api/payments/publishable-key/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        publishable_key = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '')
        return Response({
            'publishable_key': publishable_key
        })
