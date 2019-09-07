### Summary of routing
##### User
Register a new user
URL: host/api/users
METHOD:
|Key    |Value          |
|-----  |-------------- |
|Route  |host/api/users |
|Method |POST           |
|Access |Public         |
Test with Postman:
1. Create a new request
2. In `Headers` tab, insert {`Content-Type`, `application/json`}.
3. In `Body` tab, provide an object with at least 3 properties (by design, they are required fields):
```
{
	"name": "Your name here",
	"email": "Your email here",
	"password": "Your password here"
}
```
4. Send the request

Upon success, the server will send back a token. For example,
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ3MzEyNGY0OTU3NjgwYzFjZDA3OWMxIn0sImlhdCI6MTU2NzgyMjQxNSwiZXhwIjoxNjM5ODIyNDE1fQ.WXDOUJsKhF0x_8hUpiSvJXk-HoARA-F9YZrjTDDhmfU"
}
```

##### Profile

##### Post