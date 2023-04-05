# tests/integration/post-fragments.hurl
# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Body of the request goes in ```...``` when it's a string
```Hello S3!```

# 2. We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

# 3. Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 4. Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9
[Asserts]
body == "Hello S3!"

# 5. DELETE the fragment using the url as an authorized user.
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 6. Confirm that the server returns a 200.
HTTP/1.1 200

# 7. Try to GET the fragment again using the url as an authorized user.
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

#8. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404




