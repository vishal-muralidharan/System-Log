from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Employee, AttendanceLog
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Handles Add/Edit/Delete/List for Employee data.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]


class AttendanceLogViewSet(viewsets.ModelViewSet):
    """ 
    Handle Add/Edit/Delete/List for all Attendance login data 
    """
    queryset = AttendanceLog.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST']) # Marks the Login of Employees
    def mark_attendance(self, request):
        Status = request.data.get('WorkStatus', 'In-Office')

        NewLog = AttendanceLog.objects.create(
            EmployeeRef = request.user,
            WorkStatus = Status
        )

        SerializedData = self.get_serializer(NewLog)
        return Response(SerializedData, status=201)
