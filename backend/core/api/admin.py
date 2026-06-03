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

    list_display = ('employee_id', 'project_involved', 'is_admin', 'is_active', 'last_login')
    search_fields = ('employee_id', 'project_involved')
    list_filter = ('is_admin', 'is_active', 'project_involved')
    ordering = ('employee_id',)

    filter_horizontal = ()

    fieldsets = (
        ('Authentication', {'fields': ('employee_id', 'password')}),
        ('Work Info', {'fields': ('project_involved',)}),
        ('Permissions', {'fields': ('is_admin', 'is_active')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (   
        (None, {
            'classes': ('wide',),
            'fields': ('employee_id', 'password', 'project_involved', 'is_admin', 'is_active'),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj: 
            return ('employee_id',)
        return ()

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        
        last_employee = Employee.objects.filter(employee_id__startswith='EMP').order_by('id').last()
        
        if last_employee:
            last_id_num = int(last_employee.employee_id.replace('EMP', ''))
            new_id_num = last_id_num + 1
        else:
            new_id_num = 1

        initial['employee_id'] = f"EMP{new_id_num:04d}"
        return initial


    def save_model(self, request, obj, form, change):
        if obj.password and not obj.password.startswith('pbkdf2_'):
            obj.set_password(obj.password)
        super().save_model(request, obj, form, change)


@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ('employee_ref', 'work_status', 'login_time', 'logout_time')
    list_filter = ('work_status', 'login_time')
    search_fields = ('employee_ref__employee_id',)
    date_hierarchy = 'login_time'