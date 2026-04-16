📊 HTTP Status Codes (Developer Cheat Sheet)

| Code    | Name                  | When to Use (Simple)                         | Example in Your JWT App              |
| ------- | --------------------- | -------------------------------------------- | ------------------------------------ |
| **200** | OK                    | Request successful                           | Login success, profile fetched       |
| **201** | Created               | New resource created                         | User registered                      |
| **400** | Bad Request           | Client sent wrong data                       | Missing email/password               |
| **401** | Unauthorized          | No token / invalid login                     | Wrong password, no token             |
| **403** | Forbidden             | User is valid but not allowed                | Accessing admin route as normal user |
| **404** | Not Found             | Resource doesn’t exist                       | User not found                       |
| **409** | Conflict              | Duplicate data                               | Email already exists                 |
| **422** | Unprocessable Entity  | Data format is correct but invalid logically | Weak password, invalid email format  |
| **500** | Internal Server Error | Something broke on server                    | DB crash, unexpected error           |


