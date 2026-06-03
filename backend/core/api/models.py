from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class EmployeeManager(BaseUserManager):
    # Made employee_id optional (=None) here so auto-generation works
    def create_user(self, employee_id=None, password=None, **extra_fields):
        user_instance = self.model(employee_id=employee_id, **extra_fields)
        user_instance.set_password(password)
        user_instance.save(using=self._db)
        return user_instance

    def create_superuser(self, employee_id, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(employee_id, password, **extra_fields)

class Employee(AbstractBaseUser, PermissionsMixin):
    employee_id = models.CharField(max_length=50, unique=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    project_involved = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    objects = EmployeeManager()

    USERNAME_FIELD = 'employee_id'

    @property
    def is_staff(self):
        return not self.is_admin
        
    @property
    def is_superuser(self):
        return self.is_admin

    def save(self, *args, **kwargs):
        if not self.employee_id:
            last_employee = Employee.objects.filter(employee_id__startswith='EMP').order_by('id').last()
            
            if last_employee:
                last_id_num = int(last_employee.employee_id.replace('EMP', ''))
                new_id_num = last_id_num + 1
            else:
                new_id_num = 1
            
            self.employee_id = f"EMP{new_id_num:04d}"
            
        super().save(*args, **kwargs)

class AttendanceLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    employee_ref = models.ForeignKey(Employee, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    work_status = models.CharField(max_length=20)