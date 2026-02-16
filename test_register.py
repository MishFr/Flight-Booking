import requests

url = 'http://localhost:8000/api/auth/register/'
data = {
    'username': 'testuser',
    'email': 'test@example.com',
    'first_name': 'Test',
    'last_name': 'User',
    'password': 'password123'
}

response = requests.post(url, json=data)
print(f'Status Code: {response.status_code}')
print(f'Response: {response.json()}')
