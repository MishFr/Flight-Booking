from django.contrib import admin
from .models import CustomUser, Flight, Booking

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'status', 'is_staff', 'is_active')
    list_filter = ('status', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    actions = ['approve_users']

    def approve_users(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f"{updated} user(s) approved.")
        # Trigger email notifications
        from .tasks import send_approval_email_task
        for user in queryset:
            send_approval_email_task.delay(user.id)
    approve_users.short_description = "Approve selected users"

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'departure', 'arrival', 'date', 'price', 'availability', 'status')
    list_filter = ('status', 'availability', 'date')
    search_fields = ('flight_number', 'departure', 'arrival')
    ordering = ('date',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'flight', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'created_at')
    search_fields = ('user__username', 'flight__flight_number')
    ordering = ('-created_at',)
