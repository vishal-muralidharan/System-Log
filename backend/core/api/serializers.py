from rest_framework import serializers
from .models import Employee, AttendanceLog
from django.contrib.auth import get_user_model

class EmployeeSerializer(serializers.ModelSerializer):
    # Password is write-only so that it is not exposed to GET Methods.
    password = serializers.CharField(
        write_only=True, 
        required=False, 
        style={'input_type': 'password'}
    )
    EmployeeId = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        # In-Built 'password' from AbstractBaseUser
        fields = ['id', 'EmployeeId', 'ProjectInvolved', 'IsAdmin', 'IsActive', 'password']

    def validate(self, data):
        """
        Validate incoming data before it hits the create or update methods.
        If creating a NEW employee, a password must be provided.
        """
        # self.instance is None only when a new object is being created -> POST Method
        if self.instance is None and not data.get('password'):
            raise serializers.ValidationError({
                "password": "A Password is strictly required when creating a new employee."
            })
        
        return data

    def create(self, validated_data):
        """
        Cryptographically hash the password in the creation process.
        """
        Password = validated_data.pop('password', None)
        EmployeeInstance = self.Meta.model(**validated_data)
        
        # We know Password exists here because of the validate() method above,
        # but the if-check remains as a standard safety guard.
        if Password is not None:
            EmployeeInstance.set_password(Password)
            
        EmployeeInstance.save()
        return EmployeeInstance

    def update(self, instance, validated_data):
        """
        Cryptographically hash the password if a new password is entered.
        """
        Password = validated_data.pop('password', None)
        
        # Update all standard fields (e.g., ProjectInvolved, IsActive)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # If a new password was provided, hash it
        if Password is not None:
            instance.set_password(Password)
            
        instance.save()
        return instance
    

class AttendanceSerializer(serializers.ModelSerializer):
    # This pulls the actual employee ID to the frontend, and not the database row ID number.
    EmployeeStringId = serializers.ReadOnlyField(source='EmployeeRef.EmployeeId')

    class Meta:
        model = AttendanceLog
        fields = ['LogId', 'EmployeeRef', 'EmployeeStringId', 'LoginTime', 'LogoutTime', 'WorkStatus']


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('FirstName', 'LastName', 'ProjectInvolved', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        # Calls your updated manager function without passing an ID manually
        user = User.objects.create_user(
            FirstName=validated_data.get('FirstName', ''),
            LastName=validated_data.get('LastName', ''),
            ProjectInvolved=validated_data.get('ProjectInvolved', 'Unassigned'),
            password=validated_data['password']
        )
        return user