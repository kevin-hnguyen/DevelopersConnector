### Summary of routing

#### User

###### Register a new user
|Key    |Value          		|
|-------|-----------------------|
|Route  |host/api/users 		|
|Method |POST           		|
|Access |Public         		|
|File	|root/routes/api/users	|
Test with Postman:
1. Create a new request.
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

###### Login an existent user
|Key    |Value          		|
|-------|-----------------------|
|Route  |host/api/auth 			|
|Method |POST           		|
|Access |Public         		|
|File	|root/routes/api/auth	|
Test with Postman:
1. Create a new request.
2. In `Headers` tab, insert {`Content-Type`, `application/json`}.
3. In `Body` tab, provide an object with 2 properties:
```
{
	"email": "Your email here",
	"password": "Your password here"
}
```
4. Send the request.

Upon the success, the server sends back a object with token. For instance,
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ2ZDMwNDI0M2VlNzIzMTkwNDIyMjg4In0sImlhdCI6MTU2NzgyMzM4NSwiZXhwIjoxNjM5ODIzMzg1fQ.OYpUZkLK8uvycl25on1dkAJrbbSSj3DX1O2UfekUfDw"
}
```

#### Profile
###### Get my own profile
|Key    |Value          			|
|-------|---------------------------|
|Route  |host/api/profile/me 		|
|Method |GET           				|
|Access |Private         			|
|File	|root/routes/api/profile	|
Test with Postman:
1. Since it is a protected profile, an user must login or register first in order to access this page => get a token

2. Create a new request.
3. In `Headers` tab, insert a pair {`x-auth-token`, `a-real-token`}
4. No need to send any json in `Body` tab since we are not uploading anything.
5. Send the request.

Upon success, the server sends back a json format profile of the current user.

###### Let logged-in/verified user create/update his profile
|Key    |Value          			|
|-------|---------------------------|
|Route  |host/api/profile/ 			|
|Method |POST           			|
|Access |Private         			|
|File	|root/routes/api/profile	|
Test with Postman:
1. Note: `status` and `skills` are 2 required skills.
2. Since we want verified/authorized user to update his own profile => this route is protected => user must login in or register first.
3. In `Headers` tab, insert 1 pairs {`x-auth-token`, `a-real-token`} and {`Content-Type`, `application/json`} (since we need to upload information in json format filled in form => the 2nd pair is required).
4. In `Body` tab, we provide a json with at least 2 fields `status` and `skills` to upload/create.
5. Send the request.

###### Display/Get all available profiles
|Key    |Value          			|
|-------|---------------------------|
|Route  |host/api/profile/ 			|
|Method |GET           				|
|Access |Public         			|
|File	|root/routes/api/profile	|
Test with Postman:
1. Create a new request.
2. Send the request.

###### Get a profile associated with a random user given his user ID
|Key    |Value          				|
|-------|-------------------------------|
|Route  |host/api/profile/user/:user_id	|
|Method |GET           					|
|Access |Public         				|
|File	|root/routes/api/profile		|
Test with Postman:
1. Create a new request.
2. Specify a correct URL, with real user ID attached. For example,
```
localhost:5000/api/profile/user/5d6d8347c03eaf3df45b72af
```
3. Send the request.

###### Delete a profile
|Key    |Value          				|
|-------|-------------------------------|
|Route  |host/api/profile/				|
|Method |DELETE           				|
|Access |Private         				|
|File	|root/routes/api/profile		|
Test with Postman:
1. Since we want authorized user to delete his own profile only => this route is protected => user must login first to get token.
2. Create a new `DELETE` request.
3. In the `Headers` tab, insert a pair {`x-auth-token`, `a-real-token`}. There is no need for `Content-Type` since we are not posting anything information.
4. Send the request.

###### Put new experience into profile
|Key    |Value          				|
|-------|-------------------------------|
|Route  |host/api/profile/experience	|
|Method |PUT	           				|
|Access |Private         				|
|File	|root/routes/api/profile		|
Test with Postman:
1. Note: when we fill out a form to update the experiences, there are 3 mandatory fields: `title`, `company` and `from`.
2. Since we want only verified user (owner) to update the experiences himself => this route is protected => user must login first to get a correct token.
3. In the `Headers` tab, insert a pair {`x-auth-token`, `a-real-token`}. Also, insert a pair {`Content-Type`, `application/json`} since we want to post information to server.
4. In `Body` tab, provide a `Json` representing the form fields. For instance,
```
{
	"title": "Accountant at Twitter",
	"company": "Twitter",
	"location": "CA, USA",
	"from": "10-10-2010",
	"current": true
}
```
5. Send the request.

###### Delete an existent experience in profile
|Key    |Value          						|
|-------|---------------------------------------|
|Route  |host/api/profile/experience/:exp_id	|
|Method |DELETE	           						|
|Access |Private         						|
|File	|root/routes/api/profile				|
Test with Postman:
1. Ensure that user must login in first. Then, he is given a correct token.
2. Get his full profile at `host/api/profile/me`
3. Inside the `experience` field, grab an experience ID.
For example,
```
...
    "experience": [
        {
            "current": true,
            "_id": "5d73abc5c2ff831d70183006",
            "title": "Cashier",
            "company": "Walmart Northland branch",
            "location": "London, Canada",
            "from": "2015-12-15T05:00:00.000Z"
        },
        {
            "current": true,
            "_id": "5d6ed4528d5fed1a3c31c201",
            "title": "Accountant at Twitter",
            "company": "Twitter",
            "location": "CA, USA",
            "from": "2010-10-10T04:00:00.000Z"
        }
    ]
...
```
4. Create a new `DELETE` request.
5. Provide an URL, for example:
```
localhost:5000/api/profile/experience/5d73aaa6c2ff831d70183005
```
5. Send the request.

###### Put new education into profile
|Key    |Value          				|
|-------|-------------------------------|
|Route  |host/api/profile/education		|
|Method |PUT	           				|
|Access |Private         				|
|File	|root/routes/api/profile		|
Test with Postman:
1. Because we want authorized user to update his own education profile => this route is protected => user must login first to get the token.
2. Create a new `PUT` request.
3. In the `Headers` tab, insert a pair {`x-auth-token`, `a-real-token`}. Also, insert a pair {`Content-Type`, `application/json`} since we want to post information to server.
4. Note: `school`, `degree`, `fieldofstudy` and `from` are all required.
5. In `Body` tab, provide a `Json` object representing a form:
```
{
	"school": "Fanshawe College",
	"degree": "CPA diploma",
	"fieldofstudy": "Computer Programmer",
	"from": "8-2-2009",
	"to": "10-10-2010",
	"description": "LOREM IPSUM"
}
```
6. Send the request.

###### Delete an existent education in profile
|Key    |Value          						|
|-------|---------------------------------------|
|Route  |host/api/profile/education/:edu_id		|
|Method |DELETE	           						|
|Access |Private         						|
|File	|root/routes/api/profile				|
Test with Postman: refer to `Delete an existent experience in profile.`

###### Get current Github repositories of user
|Key    |Value          						|
|-------|---------------------------------------|
|Route  |host/api/profile/github/:username		|
|Method |GET	           						|
|Access |Public         						|
|File	|root/routes/api/profile				|
Test with Postman:
1. Note: the `username` in the request parameter must be a real Github username.
2. Note: this route requires developer to register this app with Github to get `client ID` and `secret`.
3. Create a new `GET` request.
4. Provide a correct URL:
```
localhost:5000/api/profile/github/kevin-hnguyen
or
localhost:5000/api/profile/github/bradtraversy
```
5. Send the request.

#### Post