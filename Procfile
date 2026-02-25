web: gunicorn flight_booking.wsgi:application --bind 0.0.0.0:$PORT
celery: celery -A flight_booking worker --loglevel=info
