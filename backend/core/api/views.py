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
    
    def create(self, request, *args, **kwargs):
        if not request.user.IsAdmin:
            return Response({"Error": "Only admins can add employees."}, status=403)
        return super().create(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.IsAdmin:
            return Response({"Error": "Only admins can delete employee data."}, status=403)
        return super().destroy(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        EmployeeInstance = self.get_object()
        SerializedEmployee = self.get_serializer(EmployeeInstance)
        
        ResponseData = SerializedEmployee.data

        Logs = AttendanceLog.objects.filter(EmployeeRef=EmployeeInstance).order_by('-LoginTime')
        
        SerializedLogs = AttendanceSerializer(Logs, many=True)
        ResponseData['AttendanceHistory'] = SerializedLogs.data

        return Response(ResponseData, status=200)
    
    def update(self, request, *args, **kwargs):
        if not request.user.IsAdmin and 'IsAdmin' in request.data:
            return Response({"Error": "You do not have permission to change admin status."}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.IsAdmin and 'IsAdmin' in request.data:
            return Response({"Error": "You do not have permission to change admin status."}, status=403)
        return super().partial_update(request, *args, **kwargs)


class AttendanceLogViewSet(viewsets.ModelViewSet):
    """ 
    Handle Add/Edit/Delete/List for all Attendance login data 
    """
    queryset = AttendanceLog.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST']) # Marks the Login of Employees
    def login(self, request):
        Date = timezone.now().date()

        LoggedToday = AttendanceLog.objects.filter(
            EmployeeRef=request.user,
            LoginTime__date=Date,
        ).exists()

        if LoggedToday:
            return Response({"Error": "Cannot have 2 logins for the same day"}, status=400)

        Status = request.data.get('WorkStatus', 'In-Office')

        NewLog = AttendanceLog.objects.create(
            EmployeeRef = request.user,
            WorkStatus = Status
        )

        if Status.lower() == 'leave':
            NewLog.LogoutTime = timezone.now()

        NewLog.save()

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
            if CloseLog.WorkStatus.lower() == 'leave':
                return Response({"Error": "Logout not required for a leave"}, status=400)
            
            CurrentTime = timezone.now()
            CloseLog.LogoutTime = CurrentTime
            CloseLog.save()

            return Response({"LogoutTime": CurrentTime}, status=200)
        
        return Response({"Error": "No open shift found for today. (Note: Previous days cannot be closed today)"}, status=404)
