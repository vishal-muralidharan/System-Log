import requests
BASE_URL = 'http://localhost:8000/api'
credentials = {"EmployeeId": "EMP0001", "password": "Asdfg1006!"}

login_response = requests.post(f"{BASE_URL}/auth/login/", json=credentials)

if login_response.status_code == 200:
    print("✅ Login Successful!")
    
    access_token = login_response.json().get('access')
    print(f"🔑 Token received: {access_token[:20]}...\n")
    
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    print("--- STEP 2: Testing Data Privacy (GET /employees/) ---")
    employee_response = requests.get(f"{BASE_URL}/employees/", headers=headers)
    print(f"Status Code: {employee_response.status_code}")
    print(f"Data: {employee_response.json()}\n")

    print("--- STEP 3: Testing Clock In (POST /attendance/login/) ---")
    clock_in_payload = {"WorkStatus": "In-Office"}
    clock_in_response = requests.post(f"{BASE_URL}/attendance/login/", json=clock_in_payload, headers=headers)
    print(f"Status Code: {clock_in_response.status_code}")
    print(f"Data: {clock_in_response.json()}\n")
    
    print("--- STEP 4: Testing Admin Block (POST /employees/) ---")
    hacker_payload = {"password": "hack", "ProjectInvolved": "hack"}
    hack_response = requests.post(f"{BASE_URL}/employees/", json=hacker_payload, headers=headers)
    print(f"Status Code: {hack_response.status_code}")
    print(f"Data: {hack_response.json()}\n")

else:
    print("❌ Login Failed!")
    print(f"Status Code: {login_response.status_code}")
    print(f"Error: {login_response.json()}")