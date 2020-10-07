# stock-chat-backend

API with Node.js and Typescript for the [StockChat APP](https://github.com/magluf/stock-chat-frontend)

## Avalição sobre o desempenho no desafio:

### PROS

- Typescript;
- ESLint;
- Utilizando a versão mais atual de todas as libs do projeto (excluindo, obviamente, as libs de dependência de outras libs)
- Scripts de geração de arquivos para produção e de deploy;
- Scripts de geração de git submodule (infelizmente, o Heroku não aceita submodules, o que fere uma rotina ótima para CI/CD de projetos que poderiam ser compilados pré-deploy.);
- Boas rotinas de segurança para a proteção de rotas;
- Boa utilização de APIs e algoritmos para manusear as rotinas de Location;

### CONS

- Sem testes :(
- A versão mais nova do Sequelize não está otimizada para o Typescript (tão quanto a lib _sequelize-typescript_), o que me forçou a usar JS puro para migrations, models e services.
- Sem Dockerfile :(
- Eu estava utilizando uma rotina local (`npm run build:heroku && npm run deploy:heroku`) utilizando scripts próprios e com git subtree para o deploy para o Heroku e infelizmente não tive tempo de configurar um CI/CD no repo.

### Heroku URL:

> https://api-zro.herokuapp.com

### Postman collection das rotas:

> https://www.getpostman.com/collections/227fce696dae1e977d37

---

# _Endpoints:_

## USERS:

### _Criar usuário_

#### Request

`POST /api/v1/users { email, password }`

```bash
curl --location --request POST 'https://api-zro.herokuapp.com/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
                "email": "test@test.test",
                "password": "test"
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "User Added!",
    "data": {
        "id": 1,
        "email": "test@test.test",
        "updatedAt": "2020-09-30T10:24:38.816Z",
        "createdAt": "2020-09-30T10:24:38.816Z"
    }
}
```

---

## AUTH

### - _Login_

#### Request

`POST /api/v1/auth/login { email, password }`

```bash
curl --location --request POST 'https://api-zro.herokuapp.com/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
                "email": "test@test.test",
                "password": "test"
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

---

## LOCATIONS:

### _Create location_

#### Request

`POST /api/v1/location { name, address }`

```bash
curl --location --request POST 'https://api-zro.herokuapp.com/api/v1/users' \
--header 'Authorization: Bearer JSONWEBTOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
                "name": "Dom Black",
                "address": "recife boa viagem"
            }'
```

> Uma string com os dois parâmetros acima ('Dom Black recife boa viagem') será utilizada na Geoposition API do Google. Quanto mais detalhes forem passados sobre o local (CEP, bairro, cidade, estado...), melhor será a chance de obter o lugar exato. O campo _name_ é utilizado para setar a coluna _name_ da tabela Locations do DB.

#### Response

```JSON
{
    "status": "success",
    "message": "Location Added!",
    "data": {
        "id": 11,
        "userId": 2,
        "name": "Dom Black",
        "latitude": -8.1085015,
        "longitude": -34.8896344,
        "country": "Brazil",
        "countryCode": "BR",
        "city": "Recife",
        "zipcode": "51020-010",
        "streetName": "Rua dos Navegantes",
        "streetNumber": "2959",
        "updatedAt": "2020-09-30T23:35:55.461Z",
        "createdAt": "2020-09-30T23:35:55.461Z"
    }
}
```

---

### - _Listar locations ordenadas por nome_

#### Request

`GET /api/v1/auth/locations/all/list`

```bash
curl --location --request GET 'https://api-zro.herokuapp.com/api/v1/locations/all/list' \
--header 'Authorization: Bearer JSONWEBTOKEN'
```

#### Response

```JSON
{
    "status": "success",
    "message": "Locations retrieved.",
    "data": [
        {
            "id": 11,
            "userId": 2,
            "name": "Dom Black",
            "latitude": -8.1085015,
            "longitude": -34.8896344,
            "country": "Brazil",
            "countryCode": "BR",
            "city": "Recife",
            "zipcode": "51020-010",
            "streetName": "Rua dos Navegantes",
            "streetNumber": "2959",
            "createdAt": "2020-09-30T23:35:55.461Z",
            "updatedAt": "2020-09-30T23:35:55.461Z"
        },
        {
            "id": 10,
            "userId": 2,
            "name": "Fervo Coffee Shop",
            "latitude": -8.1397315,
            "longitude": -34.9078277,
            "country": "Brazil",
            "countryCode": "BR",
            "city": "Recife",
            "zipcode": "51030-320",
            "streetName": "Rua Doutor Luiz Inácio Pessoa de Melo",
            "streetNumber": "350",
            "createdAt": "2020-09-30T23:33:01.868Z",
            "updatedAt": "2020-09-30T23:33:01.868Z"
        },
        {
            "id": 8,
            "userId": 2,
            "name": "Shopping Plaza Casa Forte",
            "latitude": -8.037011099999999,
            "longitude": -34.9125792,
            "country": "Brazil",
            "countryCode": "BR",
            "city": "Pernambuco",
            "zipcode": "52060-615",
            "streetName": "Rua Doutor João Santos Filho",
            "streetNumber": "255",
            "createdAt": "2020-09-30T22:54:15.641Z",
            "updatedAt": "2020-09-30T22:54:15.641Z"
        },
    ]
}
```

---

### - _Listar locations ordenadas por distância_

> Foi utilizada a lib _geoip-lite_ para obter o IP da requisição para, então, determinar a latitude e longitude utilizadas na comparação de proximidade. Caso não seja possível estabelecer o IP, esse endpoint retorna a lista de locations ordenada por nome.

#### Request

`GET /api/v1/auth/locations/all/map`

```bash
curl --location --request GET 'https://api-zro.herokuapp.com/api/v1/locations/all/map' \
--header 'Authorization: Bearer JSONWEBTOKEN'
```

#### Response

```JSON
{
    "status": "success",
    "message": "Locations retrieved.",
    "data": [
        {
            "id": 10,
            "userId": 2,
            "name": "Fervo Coffee Shop",
            "latitude": -8.1397315,
            "longitude": -34.9078277,
            "country": "Brazil",
            "countryCode": "BR",
            "city": "Recife",
            "zipcode": "51030-320",
            "streetName": "Rua Doutor Luiz Inácio Pessoa de Melo",
            "streetNumber": "350",
            "createdAt": "2020-09-30T23:33:01.868Z",
            "updatedAt": "2020-09-30T23:33:01.868Z"
        },
        {
            "id": 6,
            "userId": 2,
            "name": "Shopping Recife",
            "latitude": -8.119071600000002,
            "longitude": -34.9050808,
            "country": "Brazil",
            "countryCode": "BR",
            "city": null,
            "zipcode": "51020-900",
            "streetName": "Rua Padre Carapuceiro",
            "streetNumber": "777",
            "createdAt": "2020-09-30T22:51:28.123Z",
            "updatedAt": "2020-09-30T22:51:28.123Z"
        },
        {
            "id": 11,
            "userId": 2,
            "name": "Dom Black",
            "latitude": -8.1085015,
            "longitude": -34.8896344,
            "country": "Brazil",
            "countryCode": "BR",
            "city": "Recife",
            "zipcode": "51020-010",
            "streetName": "Rua dos Navegantes",
            "streetNumber": "2959",
            "createdAt": "2020-09-30T23:35:55.461Z",
            "updatedAt": "2020-09-30T23:35:55.461Z"
        }
    ]
}
```

---

## RATINGS:

### _Criar rating para location_

#### Request

`POST /api/v1/users/:locationId`

```bash
curl --location --request POST 'https://api-zro.herokuapp.com/api/v1/ratings/:locationId' \
--header 'Authorization: Bearer JSONWEBTOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
                "rating": 3,
                "comment": "Average."
            }'
```

#### Response

```JSON
{
    "status": "success",
    "message": "Rating Added!",
    "data": {
        "id": 4,
        "userId": 2,
        "locationId": 1,
        "rating": 3,
        "comment": "Average",
        "updatedAt": "2020-10-01T00:51:07.973Z",
        "createdAt": "2020-10-01T00:51:07.973Z"
    }
}
```

---

### _Listar todas as avaliações de um local_

#### Request

`GET /api/v1/users/:locationId`

```bash
curl --location --request GET 'https://api-zro.herokuapp.com/api/v1/ratings/:locationId' \
--header 'Authorization: Bearer JSONWEBTOKEN' \
```

#### Response

```JSON
{
    "status": "success",
    "message": "Ratings retrieved.",
    "data": [
        {
            "id": 3,
            "locationId": 1,
            "userId": 2,
            "comment": "Average",
            "rating": 3,
            "createdAt": "2020-10-01T00:05:37.009Z",
            "updatedAt": "2020-10-01T00:05:37.009Z"
        },
        {
            "id": 4,
            "locationId": 1,
            "userId": 4,
            "comment": "Very good",
            "rating": 5,
            "createdAt": "2020-10-01T00:51:07.973Z",
            "updatedAt": "2020-10-01T00:51:07.973Z"
        }
    ]
}
```

---
