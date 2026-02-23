from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that handles user lookup and validation.
    """
    
    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token.get('user_id')
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('User not found')

        if not user.is_active:
            raise AuthenticationFailed('User is inactive')

        return user
    
    def authenticate(self, request):
        """
        Authenticate the request and return a tuple of (user, token).
        """
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken as e:
            raise AuthenticationFailed(str(e))

        return (self.get_user(validated_token), validated_token)


class JWTAuthenticationMiddleware:
    """
    Middleware to ensure JWT authentication is properly handled.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip JWT validation for public endpoints
        public_paths = [
            '/api/auth/login/',
            '/api/auth/register/',
            '/api/auth/token/refresh/',
            '/api/flights/search/',
            '/api/airports/search/',
            '/api/amadeus/search/',
            '/api/',
            '/admin/',
        ]
        
        # Check if the path is public
        is_public = any(request.path.startswith(path) for path in public_paths)
        
        if not is_public:
            # For protected endpoints, ensure the Authorization header is present
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if not auth_header.startswith('Bearer '):
                # Let DRF handle the authentication check
                pass
        
        response = self.get_response(request)
        return response
