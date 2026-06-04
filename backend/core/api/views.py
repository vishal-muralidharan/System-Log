from rest_framework import viewsets, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from django.utils import timezone

from .models import Employee, AttendanceLog
from .serializers import EmployeeSerializer, AttendanceSerializer, RegisterSerializer
from .permissions import IsAdminUserCustom 

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Handles Add/Edit/Delete/List for Employee data.
    """
    serializer_class = EmployeeSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project_involved', 'is_active', 'is_admin']
    search_fields = ['employee_id']
    ordering_fields = ['id', 'employee_id']
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'destroy']:
            permission_classes = [IsAuthenticated, IsAdminUserCustom]
        else:
            permission_classes = [IsAuthenticated]
            
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Employee.objects.all()
        return Employee.objects.filter(id=user.id)
    
    def retrieve(self, request, *args, **kwargs):
        employee_instance = self.get_object()
        serialized_employee = self.get_serializer(employee_instance)
        
        response_data = serialized_employee.data

        logs = AttendanceLog.objects.filter(employee_ref=employee_instance).order_by('-login_time')
        
        serialized_logs = AttendanceSerializer(logs, many=True)
        response_data['attendance_history'] = serialized_logs.data

        return Response(response_data, status=200)

    def update(self, request, *args, **kwargs):
        if not request.user.is_admin and 'is_admin' in request.data:
            return Response({"error": "You do not have permission to change admin status."}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_admin and 'is_admin' in request.data:
            return Response({"error": "You do not have permission to change admin status."}, status=403)
        return super().partial_update(request, *args, **kwargs)


class AttendanceLogViewSet(viewsets.ModelViewSet):
    """ 
    Handle Add/Edit/Delete/List for all Attendance login data 
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['work_status', 'employee_ref'] 
    search_fields = ['employee_ref__employee_id']
    ordering_fields = ['login_time', 'logout_time']

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return AttendanceLog.objects.all()
        return AttendanceLog.objects.filter(employee_ref=user)

    @action(detail=False, methods=['POST']) # Marks the Login of Employees
    def login(self, request):
        date = timezone.now().date()

        logged_today = AttendanceLog.objects.filter(
            employee_ref=request.user,
            login_time__date=date,
        ).exists()

        if logged_today:
            return Response({"error": "Cannot have 2 logins for the same day"}, status=400)

        status = request.data.get('work_status', 'In-Office')

        new_log = AttendanceLog.objects.create(
            employee_ref=request.user,
            work_status=status
        )

        if status.lower() == 'leave':
            new_log.logout_time = timezone.now()

        new_log.save()

        serialized_data = self.get_serializer(new_log)
        return Response(serialized_data.data, status=201)
    
    @action(detail=False, methods=['POST']) # Marks the Logout of Employees
    def logout(self, request):
        date = timezone.now().date()
        
        close_log = AttendanceLog.objects.filter(
            employee_ref=request.user,
            login_time__date=date,
            logout_time__isnull=True
        ).first()

        if close_log:
            if close_log.work_status.lower() == 'leave':
                return Response({"error": "Logout not required for a leave"}, status=400)
            
            current_time = timezone.now()
            close_log.logout_time = current_time
            close_log.save()

            return Response({"logout_time": current_time}, status=200)
        
        return Response({"error": "No open shift found for today. (Note: Previous days cannot be closed today)"}, status=404)


class RegisterView(generics.CreateAPIView):
    queryset = Employee.objects.all() 
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer