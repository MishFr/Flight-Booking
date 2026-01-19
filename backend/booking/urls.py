from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('flights/search/', views.FlightSearchView.as_view(), name='flight-search'),
    path('flights/status/<str:flight_number>/', views.FlightStatusView.as_view(), name='flight-status'),
    path('flights/', views.FlightListView.as_view(), name='flight-list'),
    path('flights/<int:pk>/', views.FlightDetailView.as_view(), name='flight-detail'),
    path('bookings/', views.BookingListView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    # Admin URLs
    path('admin/users/pending/', views.AdminUserListView.as_view(), name='admin-user-pending'),
    path('admin/users/<int:pk>/approve/', views.AdminUserApproveView.as_view(), name='admin-user-approve'),
    path('admin/users/<int:pk>/reject/', views.AdminUserRejectView.as_view(), name='admin-user-reject'),
    path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/flights/', views.AdminFlightListView.as_view(), name='admin-flight-list'),
    path('admin/flights/<int:pk>/status/', views.AdminFlightStatusUpdateView.as_view(), name='admin-flight-status'),
    path('admin/flights/<int:pk>/', views.AdminFlightDetailView.as_view(), name='admin-flight-detail'),
    path('admin/booking-stats/', views.AdminBookingStatsView.as_view(), name='admin-booking-stats'),
]
