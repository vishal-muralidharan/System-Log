from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from .models import Employee, AttendanceLog
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Handles Add/Edit/Delete/List for Employee data.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        User = self.request.user
        if User.IsAdmin:
            return Employee.objects.all()
        return Employee.objects.filter(id=User.id)


class AttendanceLogViewSet(viewsets.ModelViewSet):
    """ 
    Handle Add/Edit/Delete/List for all Attendance login data 
    """
    queryset = AttendanceLog.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST']) # Marks the Login of Employees
    def login(self, request):
        Status = request.data.get('WorkStatus', 'In-Office')

        NewLog = AttendanceLog.objects.create(
            EmployeeRef = request.user,
            WorkStatus = Status
        )

        SerializedData = self.get_serializer(NewLog)
        return Response(SerializedData.data, status=201)
    
    @action(detail=False, methods=['POST']) # Marks the Logout of Employees
    def logout(self, request):
        Date = timezone.now().date()
        
        CloseLog = AttendanceLog.objects.filter(
            EmployeeRef=request.user,
            LoginTime__date=Date,
            LogoutTime__isnull=True
        ).first()

        if CloseLog:
            CurrentTime = timezone.now()
            CloseLog.LogoutTime = CurrentTime
            CloseLog.save()

            return Response({"LogoutTime": CurrentTime}, status=200)
        
        return Response({"Error": "No valid attendance login for today"}, status=404)
