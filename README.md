# stock-chat-backend

API with Node.js and Typescript for the [StockChat APP](https://github.com/magluf/stock-chat-frontend).

### App on Heroku:

> https://stock-chat-api.herokuapp.com/api/v1

### API on Heroku:

> https://stock-chat-api.herokuapp.com/api/v1

### Postman collection das rotas:

> https://www.getpostman.com/collections/227fce696dae1e977d37

---

# _Endpoints:_

## USERS:

### _Create user_

#### Request

`POST /api/v1/users { user. , password }`

```bash
curl --location --request POST 'https://stock-chat-api.herokuapp.com/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
                "username": "test",
                "email": "test@asf.com",
                "password": "123"
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "User Added!",
    "data": {
        "_id": "5f7e0bd2af805100172f4403",
        "username": "test",
        "email": "test@asf.com",
        "createdAt": "2020-10-07T18:41:22.952Z",
        "updatedAt": "2020-10-07T18:41:22.952Z",
        "__v": 0
    }
}
```

---

## AUTH

### - _Login_

#### Request

`POST /api/v1/auth/login { username, password }`

```bash
curl --location --request POST 'https://stock-chat-api.herokuapp.com/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
                "username": "testuser",
                "password": "123"
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "User logged in!",
    "data": {
        "token": "xxx"
    }
}
```

### - _Logout_

#### Request

`GET /api/v1/auth/logout`

```bash
curl --location --request POST 'https://stock-chat-api.herokuapp.com/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
                "username": "testuser",
                "password": "123"
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "User logged in!",
    "data": {
        "_id": "5f7e0bd2af805100172f4403",
        "username": "test",
        "email": "test@asf.com"
    }
}
```

---

## MESSAGES

### - _Create message_

#### Request

`POST /api/v1/messages/ { author[id], channel[id], content }`

```bash
curl --location --request POST 'https://stock-chat-api.herokuapp.com/api/v1/messages/' \
--header 'Content-Type: application/json' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2UwYmQyYWY4MDUxMDAxNzJmNDQwMyIsImlhdCI6MTYwMjA5NjQ5NSwiZXhwIjoxNjAyMTgyODk1fQ.YA0sDwt_1sYoXtBELsYlyrAOQSLIBR8sfgdLNXrS-tU' \
--data-raw '{
                "author": "5f7e06fe8dd4f90017eb274a",
                "channel": "5f7d63d29672610b98fe42cc",
                "content": "Hello!"
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "Message Added!",
    "data": {
        "_id": "5f7e0dfdaf805100172f4404",
        "author": {
            "_id": "5f7e06fe8dd4f90017eb274a",
            "createdAt": "2020-10-07T18:20:46.521Z",
            "updatedAt": "2020-10-07T18:20:46.521Z",
            "__v": 0
        },
        "channel": {
            "_id": "5f7d63d29672610b98fe42cc",
            "name": "general",
            "details": "Generalities.",
            "createdAt": "2020-10-07T06:44:35.147Z",
            "updatedAt": "2020-10-07T06:44:35.147Z",
            "__v": 0
        },
        "content": "Hello!",
        "createdAt": "2020-10-07T18:50:37.611Z",
        "updatedAt": "2020-10-07T18:50:37.611Z",
        "__v": 0
    }
}
```

## - _Get messages by channel_

#### Request

`GET /api/v1/messages/channel/:channelId`

```bash
curl --location --request GET 'https://stock-chat-api.herokuapp.com/api/v1/messages/channel/5f7d63d29672610b98fe42cc' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2UwYmQyYWY4MDUxMDAxNzJmNDQwMyIsImlhdCI6MTYwMjA5NjQ5NSwiZXhwIjoxNjAyMTgyODk1fQ.YA0sDwt_1sYoXtBELsYlyrAOQSLIBR8sfgdLNXrS-tU'
```

#### Response

```JSON
{
    "status": "success",
    "message": "Messages retrieved.",
    "data": [
        {
            "_id": "5f7e0dfdaf805100172f4404",
            "author": {
                "_id": "5f7e06fe8dd4f90017eb274a",
                "username": "testuser",
                "email": "ffff@asf.com",
                "createdAt": "2020-10-07T18:20:46.521Z",
                "updatedAt": "2020-10-07T18:20:46.521Z",
                "__v": 0
            },
            "channel": {
                "_id": "5f7d63d29672610b98fe42cc",
                "name": "general",
                "details": "Generalities.",
                "createdAt": "2020-10-07T06:44:35.147Z",
                "updatedAt": "2020-10-07T06:44:35.147Z",
                "__v": 0
            },
            "content": "Hello!",
            "createdAt": "2020-10-07T18:50:37.611Z",
            "updatedAt": "2020-10-07T18:50:37.611Z",
            "__v": 0
        }
    ]
}
```
