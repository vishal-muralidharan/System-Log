from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ApiOverview

urlpatterns = [
    path('', ApiOverview, name='ApiOverview'),
    path('auth/login/', TokenObtainPairView.as_view(), name='TokenObtainPair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='TokenRefresh'),
]