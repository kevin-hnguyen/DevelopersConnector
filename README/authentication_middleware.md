### Middleware to verify an user
Source file: root/middleware/auth.js
We bring in the `jsonwebtoken` and the `config` package.
We target the `x-auth-token` field of the request header.

```
const token = req.header("x-auth-token");
```

We check if `token` exists or not. If it does not exist, then short circuit the function with `401` code stating that there is no token and authorization is denied.

```
if (!token) {
    return res.status(401).json({
        msg: "No token found. Authorization denied."
    });
}
```
If the `token` is shipped with the request, we check for its validity. We wrap the whole test inside a `try-catch` structure. In case of error/failure, we return a `401` code with the same message: no token found and authorization is ended.
We invoke the `verify` method of `jsonwebtoken`:
```
const decoded = jwt.verify(token, config.get("jwtsecret"));
```
The second argument is fetched from the `root/config/default` file. In that file, there is an entry called `jwtsecret` where we store the hidden key in plain text.
Next, we attach a new property `user` into the request object and ship it to the next route.
```
req.user = decoded.user;
```
Finally, since this is just middleware, for the sake of authorization only, if everything works out, we call the call-back or the end function.