"""
Custom DRF exception handlers for the Flight Booking application.

This module provides custom exception classes and a custom exception handler
for consistent error responses across the API.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class AmadeusServiceException(Exception):
    """
    Exception raised when there's an error with the Amadeus service.
    """
    def __init__(self, message="Amadeus service error", code="AMADEUS_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class FlightNotFoundException(Exception):
    """
    Exception raised when a requested flight is not found.
    """
    def __init__(self, message="Flight not found", code="FLIGHT_NOT_FOUND"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class OrderCreationException(Exception):
    """
    Exception raised when there's an error creating an order.
    """
    def __init__(self, message="Failed to create order", code="ORDER_CREATION_FAILED"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class OrderNotFoundException(Exception):
    """
    Exception raised when a requested order is not found.
    """
    def __init__(self, message="Order not found", code="ORDER_NOT_FOUND"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class InvalidFlightDataException(Exception):
    """
    Exception raised when flight data validation fails.
    """
    def __init__(self, message="Invalid flight data", code="INVALID_FLIGHT_DATA"):
        self.message = message
        self.code = code
        super().__init__(self.message)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that provides consistent error responses.
    
    Args:
        exc: The exception that was raised.
        context: The context dictionary containing request and view information.
        
    Returns:
        Response: A standardized error response.
    """
    # Handle custom exceptions
    if isinstance(exc, AmadeusServiceException):
        logger.error(f"Amadeus Service Error: {exc.message}")
        return Response(
            {
                'error': {
                    'code': exc.code,
                    'message': exc.message
                }
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    if isinstance(exc, FlightNotFoundException):
        logger.warning(f"Flight Not Found: {exc.message}")
        return Response(
            {
                'error': {
                    'code': exc.code,
                    'message': exc.message
                }
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    if isinstance(exc, OrderCreationException):
        logger.error(f"Order Creation Error: {exc.message}")
        return Response(
            {
                'error': {
                    'code': exc.code,
                    'message': exc.message
                }
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if isinstance(exc, OrderNotFoundException):
        logger.warning(f"Order Not Found: {exc.message}")
        return Response(
            {
                'error': {
                    'code': exc.code,
                    'message': exc.message
                }
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    if isinstance(exc, InvalidFlightDataException):
        logger.warning(f"Invalid Flight Data: {exc.message}")
        return Response(
            {
                'error': {
                    'code': exc.code,
                    'message': exc.message
                }
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Call REST framework's default exception handler
    response = exception_handler(exc, context)
    
    # If response is None, something unexpected happened
    if response is None:
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return Response(
            {
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An unexpected error occurred. Please try again later.'
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Format validation errors
    if response.status_code == 400:
        if 'non_field_errors' in response.data:
            response.data = {
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Validation failed',
                    'details': response.data['non_field_errors']
                }
            }
        elif isinstance(response.data, dict):
            # Format field-specific errors
            errors = {}
            for field, value in response.data.items():
                if isinstance(value, list):
                    errors[field] = value[0] if value else 'Invalid value'
                else:
                    errors[field] = str(value)
            response.data = {
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Validation failed',
                    'details': errors
                }
            }
    
    # Handle authentication errors
    if response.status_code == 401:
        response.data = {
            'error': {
                'code': 'AUTHENTICATION_FAILED',
                'message': 'Authentication credentials were not provided or are invalid.'
            }
        }
    
    # Handle permission errors
    if response.status_code == 403:
        response.data = {
            'error': {
                'code': 'PERMISSION_DENIED',
                'message': 'You do not have permission to perform this action.'
            }
        }
    
    # Handle not found errors
    if response.status_code == 404:
        response.data = {
            'error': {
                'code': 'NOT_FOUND',
                'message': 'The requested resource was not found.'
            }
        }
    
    return response
