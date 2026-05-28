from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class EmployeeManager(BaseUserManager):
    # Made EmployeeId optional (=None) here so auto-generation works
    def create_user(self, EmployeeId=None, password=None, **ExtraFields):
        UserInstance = self.model(EmployeeId=EmployeeId, **ExtraFields)
        UserInstance.set_password(password)
        UserInstance.save(using=self._db)
        return UserInstance

    def create_superuser(self, EmployeeId, password=None, **ExtraFields):
        ExtraFields.setdefault('IsAdmin', True)
        ExtraFields.setdefault('IsActive', True)
        return self.create_user(EmployeeId, password, **ExtraFields)

class Employee(AbstractBaseUser, PermissionsMixin):
    EmployeeId = models.CharField(max_length=50, unique=True, blank=True)
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    ProjectInvolved = models.CharField(max_length=100)
    IsAdmin = models.BooleanField(default=False)
    IsActive = models.BooleanField(default=False)

    objects = EmployeeManager()

    USERNAME_FIELD = 'EmployeeId'

    @property
    def is_staff(self):
        return self.IsAdmin
        
    @property
    def is_superuser(self):
        return self.IsAdmin

    def save(self, *args, **kwargs):
        if not self.EmployeeId:
            LastEmployee = Employee.objects.filter(EmployeeId__startswith='EMP').order_by('id').last()
            
            if LastEmployee:
                LastIdNum = int(LastEmployee.EmployeeId.replace('EMP', ''))
                NewIdNum = LastIdNum + 1
            else:
                NewIdNum = 1
            
            self.EmployeeId = f"EMP{NewIdNum:04d}"
            
        super().save(*args, **kwargs)

class AttendanceLog(models.Model):
    LogId = models.AutoField(primary_key=True)
    EmployeeRef = models.ForeignKey(Employee, on_delete=models.CASCADE)
    LoginTime = models.DateTimeField(auto_now_add=True)
    LogoutTime = models.DateTimeField(null=True, blank=True)
    WorkStatus = models.CharField(max_length=20)