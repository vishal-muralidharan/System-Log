from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Employee, AttendanceLog

@admin.register(Employee)
class CustomEmployeeAdmin(UserAdmin):    
    list_display = ('EmployeeId', 'project_badge', 'IsAdmin', 'IsActive', 'last_login')
    search_fields = ('EmployeeId', 'ProjectInvolved')
    list_filter = ('IsAdmin', 'IsActive', 'ProjectInvolved')
    ordering = ('EmployeeId',)

    fieldsets = (
        ('Authentication', {'fields': ('EmployeeId', 'password')}),
        ('Work Info', {'fields': ('ProjectInvolved',)}),
        ('Permissions', {'fields': ('IsAdmin', 'IsActive', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (   
        (None, {
            'classes': ('wide',),
            'fields': ('EmployeeId', 'password', 'ProjectInvolved', 'IsAdmin', 'IsActive'),
        }),
    )

@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ('EmployeeRef', 'status_label', 'LoginTime', 'LogoutTime')
    list_filter = ('WorkStatus', 'LoginTime')
    search_fields = ('EmployeeRef__EmployeeId',)
    date_hierarchy = 'LoginTime'