<p align="center">
  <a href="" rel="noopener">
</p>

<h1 align="center">node-ts</h1>

<div align="center">

[![Version](https://img.shields.io/github/package-json/v/magluf/node-ts/master)]()&nbsp;&nbsp;&nbsp;
[![Status](https://img.shields.io/badge/status-active-success.svg)]()&nbsp;&nbsp;&nbsp;
[![Last Commit](https://img.shields.io/github/last-commit/magluf/node-ts/master)]()&nbsp;&nbsp;&nbsp;
[![Commit Activity](https://img.shields.io/github/commit-activity/m/magluf/node-ts)]()&nbsp;&nbsp;&nbsp;

</div>

---

<p align="center"> Template project for Node.js + Typescript APIs.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Suggested typings changes](#typings_changes)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)
<p align="center">
  <a href="" rel="noopener">
</p>

## 🧐 About <a name = "about"></a>

This project was born out of learning hunger and to also implement a good starting point for Node.js apps with some other flavours in it (for now, just TypeScript and MongoDB.)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

#### Node.js v12.x

```bash
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs
```

### Running the app

#### Install project packages

```bash
npm i
```

#### And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo.

## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [node.js](https://nodejs.org/en/) - Server Environment
- [ts-node](https://github.com/TypeStrong/ts-node) - TypeScript execution and REPL for node.js

## 🪄 Suggested typings changes <a name = "typings_changes"></a>

This required changes to the local `node_modules` version of `@types` libs, which can't be represented on repos.

> `/@types/mongoose/index.d.ts`
>
> ```typescript
> // from
> new(doc?: any): T;
>
> // to
> new(doc?: Omit<T, keyof Document>): T;
> ```
>
> This allows for type checking when creating models from Schemas.
>
> An interface is needed for proper intellisense and type checking:
>
> ```typescript
> interface IUser extends Document {
>   username: string;
>   password: string;
> }
>
> const userSchema: Schema = new Schema({
>   username: {
>     type: String,
>     required: true,
>     unique: true,
>   },
>   email: {
>     type: String,
>     required: 'Email adress is required.',
>     trim: true,
>     lowercase: true,
>     unique: true,
>     match: [emailRegex, 'Email adress is invalid.'],
>   },
> });
>
> const User = model<IUser>('User', userSchema);
>
> const testUser = new User({
>   // intellise and typechecking available here.
>   username: 'User Name',
>   email: 'user@email.com',
> });
> ```

## ✍️ Authors <a name = "authors"></a>

- [@magluf](https://github.com/magluf) - Idea & Initial work
