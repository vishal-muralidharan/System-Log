from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms

from .models import Employee, AttendanceLog

class SimpleEmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = '__all__'


@admin.register(Employee)
class CustomEmployeeAdmin(UserAdmin):
    form = SimpleEmployeeForm
    add_form = SimpleEmployeeForm

    list_display = ('EmployeeId', 'ProjectInvolved', 'IsAdmin', 'IsActive', 'last_login')
    search_fields = ('EmployeeId', 'ProjectInvolved')
    list_filter = ('IsAdmin', 'IsActive', 'ProjectInvolved')
    ordering = ('EmployeeId',)

    filter_horizontal = ()

    fieldsets = (
        ('Authentication', {'fields': ('EmployeeId', 'password')}),
        ('Work Info', {'fields': ('ProjectInvolved',)}),
        ('Permissions', {'fields': ('IsAdmin', 'IsActive')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (   
        (None, {
            'classes': ('wide',),
            'fields': ('EmployeeId', 'password', 'ProjectInvolved', 'IsAdmin', 'IsActive'),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj: 
            return ('EmployeeId',)
        return ()

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        
        LastEmployee = Employee.objects.filter(EmployeeId__startswith='EMP').order_by('id').last()
        
        if LastEmployee:
            LastIdNum = int(LastEmployee.EmployeeId.replace('EMP', ''))
            NewIdNum = LastIdNum + 1
        else:
            NewIdNum = 1

        initial['EmployeeId'] = f"EMP{NewIdNum:04d}"
        return initial


    def save_model(self, request, obj, form, change):
        if obj.password and not obj.password.startswith('pbkdf2_'):
            obj.set_password(obj.password)
        super().save_model(request, obj, form, change)


@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ('EmployeeRef', 'WorkStatus', 'LoginTime', 'LogoutTime')
    list_filter = ('WorkStatus', 'LoginTime')
    search_fields = ('EmployeeRef__EmployeeId',)
    date_hierarchy = 'LoginTime'