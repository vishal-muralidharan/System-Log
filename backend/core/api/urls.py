from django.urls import path, include
from .views import RegisterView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import EmployeeViewSet, AttendanceLogViewSet

# The router automatically generates standard CRUD URLs for your viewsets
ApiRouter = DefaultRouter()
ApiRouter.register(r'employees', EmployeeViewSet, basename='employee')
ApiRouter.register(r'attendance', AttendanceLogViewSet, basename='attendance')

urlpatterns = [
    path('', include(ApiRouter.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='TokenObtainPair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='TokenRefresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
]