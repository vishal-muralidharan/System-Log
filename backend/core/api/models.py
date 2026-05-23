from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class EmployeeManager(BaseUserManager):
    def create_user(self, EmployeeId, Password=None, **ExtraFields):
        if not EmployeeId:
            raise ValueError('EMPLOYEE ID REQUIRED')
        UserInstance = self.model(EmployeeId=EmployeeId, **ExtraFields)
        UserInstance.set_password(Password)
        UserInstance.save(using=self._db)
        return UserInstance


class Employee(AbstractBaseUser):
    EmployeeId = models.CharField(max_length=50, unique=True)
    ProjectInvolved = models.CharField(max_length=100)
    IsAdmin = models.BooleanField(default=False)
    IsActive = models.BooleanField(default=True)

    objects = EmployeeManager()

    USERNAME_FIELD = 'EmployeeId'


class AttendanceLog(models.Model):
    LogId = models.AutoField(primary_key=True)
    EmployeeRef = models.ForeignKey(Employee, on_delete=models.CASCADE)
    LoginTime = models.DateTimeField(auto_now_add=True)
    LogoutTime = models.DateTimeField(null=True, blank=True)
    WorkStatus = models.CharField(max_length=20)