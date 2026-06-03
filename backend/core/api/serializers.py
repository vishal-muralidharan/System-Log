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
    employee_id = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        # In-Built 'password' from AbstractBaseUser
        fields = ['id', 'employee_id', 'project_involved', 'is_admin', 'is_active', 'password']

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
        password = validated_data.pop('password', None)
        employee_instance = self.Meta.model(**validated_data)
        
        # We know password exists here because of the validate() method above,
        # but the if-check remains as a standard safety guard.
        if password is not None:
            employee_instance.set_password(password)
            
        employee_instance.save()
        return employee_instance

    def update(self, instance, validated_data):
        """
        Cryptographically hash the password if a new password is entered.
        """
        password = validated_data.pop('password', None)
        
        # Update all standard fields (e.g., project_involved, is_active)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # If a new password was provided, hash it
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance
    

class AttendanceSerializer(serializers.ModelSerializer):
    # This pulls the actual employee ID to the frontend, and not the database row ID number.
    employee_string_id = serializers.ReadOnlyField(source='employee_ref.employee_id')

    class Meta:
        model = AttendanceLog
        fields = ['log_id', 'employee_ref', 'employee_string_id', 'login_time', 'logout_time', 'work_status']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Employee
        fields = ('employee_id', 'first_name', 'last_name', 'project_involved', 'password', 'password_confirm')
        read_only_fields = ('employee_id',)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        user = Employee.objects.create_user(
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            project_involved=validated_data.get('project_involved', 'Unassigned'),
            password=validated_data['password']
        )
        return user