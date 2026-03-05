"""
GPS-based Airport Search Views

This module provides API endpoints for finding nearby airports based on GPS coordinates.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .iata_utils import find_nearby_airports, get_nearest_airport
import logging

logger = logging.getLogger(__name__)


class NearbyAirportsView(APIView):
    """
    API endpoint to find nearby airports based on GPS coordinates.
    
    GET parameters:
    - latitude: User's latitude
    - longitude: User's longitude  
    - limit: Maximum number of airports to return (default: 5)
    - max_distance: Maximum distance in km (default: 500)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            latitude = float(request.query_params.get('latitude'))
            longitude = float(request.query_params.get('longitude'))
        except (TypeError, ValueError):
            return Response({
                'error': 'Valid latitude and longitude are required'
            }, status=400)

        limit = int(request.query_params.get('limit', 5))
        max_distance = int(request.query_params.get('max_distance', 500))

        airports = find_nearby_airports(
            latitude=latitude,
            longitude=longitude,
            limit=limit,
            max_distance=max_distance
        )

        return Response({
            'success': True,
            'data': airports,
            'count': len(airports)
        })


class NearestAirportView(APIView):
    """
    API endpoint to get the nearest airport to given GPS coordinates.
    
    GET parameters:
    - latitude: User's latitude
    - longitude: User's longitude
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            latitude = float(request.query_params.get('latitude'))
            longitude = float(request.query_params.get('longitude'))
        except (TypeError, ValueError):
            return Response({
                'error': 'Valid latitude and longitude are required'
            }, status=400)

        airport = get_nearest_airport(
            latitude=latitude,
            longitude=longitude
        )

        if airport:
            return Response({
                'success': True,
                'data': airport
            })
        else:
            return Response({
                'success': False,
                'error': 'No nearby airport found'
            }, status=404)

