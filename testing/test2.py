import requests
BASE_URL = 'http://localhost:8000/api'
credentials = {"EmployeeId": "EMP0004", "password": "Asdfg1006!"}

login_response = requests.post(f"{BASE_URL}/auth/login/", json=credentials)

if login_response.status_code == 200:
    print("✅ Login Successful!")
    
    access_token = login_response.json().get('access')
    print(f"🔑 Token received: {access_token[:20]}...\n")
    
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    print("--- STEP 1: Testing Clock Out (POST /attendance/logout/) ---")
    logout_response = requests.post(f"{BASE_URL}/attendance/logout/", headers=headers)
    print(f"Status Code: {logout_response.status_code}")
    print(f"Data: {logout_response.json()}\n")

    print("--- STEP 2: Testing Double Clock Out Prevention ---")
    # Trying to clock out again when already clocked out
    logout_again = requests.post(f"{BASE_URL}/attendance/logout/", headers=headers)
    print(f"Status Code: {logout_again.status_code}")
    print(f"Data: {logout_again.json()}\n")

else:
    print("❌ Login Failed!")
    print(f"Status Code: {login_response.status_code}")
    print(f"Error: {login_response.json()}")