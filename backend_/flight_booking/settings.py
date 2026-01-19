AUTH_USER_MODEL = 'booking.CustomUser'

# Amadeus API Configuration
AMADEUS_API_KEY = 'YOUR_AMADEUS_API_KEY'
AMADEUS_API_SECRET = 'YOUR_AMADEUS_API_SECRET'
AMADEUS_BASE_URL = 'https://test.api.amadeus.com'
=======
# Custom user model
AUTH_USER_MODEL = 'booking.CustomUser'

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'

# Amadeus API Configuration
AMADEUS_API_KEY = 'YOUR_AMADEUS_API_KEY'
AMADEUS_API_SECRET = 'YOUR_AMADEUS_API_SECRET'
AMADEUS_BASE_URL = 'https://test.api.amadeus.com'
