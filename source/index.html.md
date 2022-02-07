---
title: Album API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell
  - javascript

toc_footers:
  - <a href="https://www.flaticon.com/free-icons/album" title="album icons">Icône album créée par Freepik - Flaticon</a>
  - <a href='https://github.com/slatedocs/slate'>Documentation créée avec Slate</a>

includes:
  - errors

search: true

code_clipboard: true

meta:
  - name: description
    content: Documentation pour l'API Album
---

# Introduction

Bienvenue sur l'API Album ! Vous pouvez accéder à différents endpoints permettant de :

* Récupérer des photos et leurs informations associées,
* Ajouter de nouvelles photos,
* Supprimer des photos,
* Enregistrer et authentifier un utilisateur.

Cette documentation a été écrite en Markdown, et convertie en HTML avec [Slate](https://github.com/slatedocs/slate).

# URL de base de l'API

L'API est déployée à l'URL <https://album-api.benoithubert.me>.

**Tous les endpoints** décrits ci-dessous sont **relatifs à cette origine**.

# Authentification

> Pour effectuer une requête sur un endpoint "protégé", utiliser le code 

```shell
curl "https://album-api.benoithubert.me/api/v2/posts/11" \
  -k \
  -X DELETE
  -H "Authorization: Bearer JWT"
```

```javascript
fetch('https://album-api.benoithubert.me/api/v2/posts/11', {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${JWT}`
  }
})
  .then(res => res.json())
```

> Remplacez `JWT` par votre JSON Web Token

**Certains endpoints** requièrent un JSON Web Token placé dans le header `Authorization`, sous le format :

`Bearer JWT`

Ce JWT aura été préalablement obtenu via une requête de "login" (voir "Endpoints authentification" puis "Authentifier un utilisateur").

<aside class="notice">
Remplacez <code>JWT</code> par votre JSON Web Token.
</aside>

# Endpoints authentification

## Inscrire un nouvel utilisateur

```shell
curl "https://album-api.benoithubert.me/api/v2/auth/register" \
  -k \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"login":"foobar@example.com","pwd":"FooB1"}'
```

```javascript
const payload = { login: 'foobar@example.com', pwd: 'FooB1' };
fetch('https://album-api.benoithubert.me/api/v2/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => { /* success! data is an empty object */ })
```

> Les requêtes ci-dessus renvoient un JSON structuré comme ceci :

```json
{}
```

Ce endpoint permet d'inscrire un nouvel utilisateur.

### Requête HTTP

`POST https://album-api.benoithubert.me/api/v2/auth/register`

### Champs du corps de requête

Champ     | Requis | Description
--------- | ------ | -----------
login     | oui    | Adresse e-mail valide
pwd       | oui    | Mot de passe (5 caractères MINIMUM)

### Codes de retour HTTP

* `201` : succès
* `400` : champ(s) manquant(s) ou invalides
* `409` : adresse e-mail déjà enregistrée

## Authentifier un utilisateur

```shell
curl "https://album-api.benoithubert.me/api/v2/auth/login" \
  -k \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"login":"foobar@example.com","pwd":"FooB1"}'
```

```javascript
const payload = { login: 'foobar@example.com', pwd: 'FooB1' };
fetch('https://album-api.benoithubert.me/api/v2/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => { /* success! data contains token and user */ })
```

> Les requêtes ci-dessus renvoient un JSON structuré comme ceci :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibG9naW4iOiJmb29iYXI4MUBleGFtcGxlLmNvbSIsImF2YXRhciI6bnVsbCwiaWF0IjoxNjQ0MjkxODcxfQ.N2FmgzNGICjrEOg5qYVgNEnAwzZu_x5Ag9ecTihNjZo",
  "user": {
    "id": 1,
    "login": "foobar@example.com",
    "avatar": null
  }
}
```

Ce endpoint permet d'authentifier un utilisateur déjà inscrit.

### Requête HTTP

`POST https://album-api.benoithubert.me/api/v2/auth/login`

### Champs du corps de requête

Champ     | Requis | Description
--------- | ------ | -----------
login     | oui    | Adresse e-mail valide
pwd       | oui    | Mot de passe (5 caractères MINIMUM)

### Codes de retour HTTP

* `200` : succès
* `400` : champ(s) manquant(s) ou invalides
* `401` : identifiants invalides

## Obtenir les informations de l'utilisateur

> Remplacer JWT par votre token obtenu après login :

```shell
curl "https://album-api.benoithubert.me/api/v2/auth/user" \
  -k \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT"
```

```javascript
fetch('https://album-api.benoithubert.me/api/v2/auth/user', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT}`
  }
})
  .then(res => res.json())
  .then(user => { /* success! user contains user info */ })
```

> Les requêtes ci-dessus renvoient un JSON structuré comme ceci :

```json
{
  "id": 5,
  "login": "foobar82@example.com",
  "avatar": null
}
```

Ce endpoint permet de récupérer les données d'un utilisateur. **Il nécessite le passage d'un JWT** dans le header `Authorization`.

### Requête HTTP

`GET https://album-api.benoithubert.me/api/v2/auth/user`

### Codes de retour HTTP

* `200` : succès
* `401` : JSON Web Token

## Get a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get(2)
```

```shell
curl "http://example.com/api/kittens/2" \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.get(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

This endpoint retrieves a specific kitten.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to retrieve

## Delete a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.delete(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.delete(2)
```

```shell
curl "http://example.com/api/kittens/2" \
  -X DELETE \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.delete(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "deleted" : ":("
}
```

This endpoint deletes a specific kitten.

### HTTP Request

`DELETE http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to delete

