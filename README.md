# stock-chat-backend

API with Node.js and Typescript for the [StockChat APP](https://github.com/magluf/stock-chat-frontend).

## Deployed app on Heroku:

> https://stock-chat-apa.herokuapp.com/

### Deployed API on Heroku:

> https://stock-chat-api.herokuapp.com/api/v1

### Postman collection for route testing:

> https://www.getpostman.com/collections/227fce696dae1e977d37

---

# BONUS CHALLENGE TASKS ACCOMPLISHED:

- Two chat rooms;
- Unit testing creating a user with a not unique username;
- Errors handled: invalid commands (only the `/stock=` command is available), invalid stock code and issues with retrieving data from [stooq.com](stooq.com);

# PERCEIVED ISSUES:

- Heroku doesn't handle cookies well on Chrome, so I've decided to check if the app is running on Heroku and use the auth token on headers then. Cookies seemed to work fine on Firefox, even if on Heroku.

- There are /major/ undocumented issues trying to implement sockets with mongoose during development, so I had to make a decision to diverge away from it, even if it's the obvious answer for a chat app. I had already set up most of the work with MongoDB and mongoose, so I didn't have the time to change approaches. So, I've implement polling (querying the database for new messages every 1) instead. Even if so, the technic for polling using hooks with React is quite good.

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
