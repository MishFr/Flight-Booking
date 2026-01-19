# Flight Booking Application

A full-stack flight booking application built with React for the frontend and Django for the backend. This application allows users to search for flights, make bookings, manage profiles, and access various travel-related features.

## Features

- **User Authentication**: Register, login, and manage user profiles with JWT authentication
- **Flight Search**: Search and book flights using Amadeus API integration
- **Booking Management**: View and manage flight bookings
- **Admin Panel**: Administrative dashboard for managing flights, users, and bookings
- **Notifications**: Real-time notifications for booking updates
- **Special Offers**: Access to special flight deals and promotions
- **Travel Insights**: Travel-related information and analytics
- **Payment Integration**: Secure payment processing for bookings
- **Accommodation Search**: Find and book accommodations
- **Magazine**: Travel magazine with articles and tips
- **Marketplace**: Travel-related marketplace for additional services

## Tech Stack

### Frontend
- React 18.2.0
- Redux Toolkit for state management
- React Router DOM for navigation
- Axios for API calls
- React Testing Library for testing

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django REST Framework Simple JWT 5.3.0
- Celery 5.3.4 for background tasks
- SQLite database
- Pillow for image handling

### External APIs
- Amadeus API for flight data

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Redis (for Celery broker)
- Git

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (optional, for admin access):
   ```bash
   python manage.py createsuperuser
   ```

7. Configure environment variables in `flight_booking/settings.py`:
   - Set your Amadeus API key and secret
   - Configure email settings for notifications
   - Update Redis URL if needed

### Frontend Setup

1. Navigate to the root directory (if not already there):
   ```bash
   cd ..
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Backend

1. Activate the virtual environment (if not already activated):
   ```bash
   cd backend
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

2. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

3. Start Celery worker (in a separate terminal):
   ```bash
   celery -A flight_booking worker --loglevel=info
   ```

The backend will be running at `http://localhost:8000`

### Frontend

1. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be running at `http://localhost:3000`

## API Endpoints

The backend provides RESTful API endpoints for:

- `/api/auth/` - Authentication (login, register, token refresh)
- `/api/flights/` - Flight search and management
- `/api/bookings/` - Booking operations
- `/api/users/` - User profile management
- `/api/admin/` - Administrative functions
- `/api/notifications/` - Notification management
- `/api/special-offers/` - Special offers and promotions
- `/api/travel-insights/` - Travel insights and analytics

## Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
python manage.py test
```

## Building for Production

### Frontend
```bash
npm run build
```

This will create a production build in the `build` directory.

### Backend
Configure your production settings in `flight_booking/settings.py` and deploy using your preferred method (e.g., Gunicorn, Docker).

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the GitHub repository.
