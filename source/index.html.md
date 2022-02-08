---
title: Album API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell
  - javascript

toc_footers:
  - <a href="https://www.flaticon.com/free-icons/album" title="album icons">Icône album par Freepik - Flaticon</a>
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

Bienvenue sur l'**API Album** ! Vous pouvez accéder à différents endpoints permettant de :

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

> La requête ci-dessus renvoie un JSON structuré comme ceci :

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

> La requête ci-dessus renvoie un JSON structuré comme ceci :

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

> La requête ci-dessus renvoie un JSON structuré comme ceci :

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
* `401` : JSON Web Token invalide ou expiré

# Endpoints posts

## Obtenir tous les posts

```shell
curl -k "https://album-api.benoithubert.me/api/v2/posts"
```

```javascript
fetch('https://album-api.benoithubert.me/api/v2/posts')
  .then(res => res.json())
  .then(posts => { /* success! posts contains an array */ })
```

> La requête ci-dessus renvoie un JSON structuré comme ceci :

```json
[
  {
    "id": 158,
    "title": "Earth Rise",
    "slug": "earth-rise",
    "description": "Picture taken from the moon",
    "picture": "https://static.demilked.com/wp-content/uploads/2016/11/top-100-photos-most-influential-all-time-5.jpg",
    "likes": 0,
    "createdAt": "2022-02-07T21:15:28.909Z",
    "tags": [],
    "user": { "id": 3, "email": "test91@test.com", "avatar": null }
  },
  {
    "id": 159,
    "title": "Pillow Fight",
    "slug": "pillow-fight",
    "description": "The Beatles pillow-fighting",
    "picture": "https://static.boredpanda.com/blog/wp-content/uploads/2016/11/top-100-world-photos-influential-all-time-30-5835a68f218d2__880.jpg",
    "likes": 0,
    "createdAt": "2022-02-07T21:29:31.290Z",
    "tags": [],
    "user": { "id": 4, "email": "test92@test.com", "avatar": null }
  }
]
```

Ce endpoint permet de récupérer tous les posts.

### Requête HTTP

* v2 (courante) : `GET https://album-api.benoithubert.me/api/v2/posts`
* v1 (_legacy_) : `GET https://album-api.benoithubert.me/api/posts`

## Obtenir un post spécifique

> Remplacer ID par l'ID du post

```shell
curl -k "https://album-api.benoithubert.me/api/v2/posts/ID"
```

```javascript
fetch(`https://album-api.benoithubert.me/api/v2/posts/${ID}`)
  .then(res => res.json())
  .then(post => { /* success! post is an object */ })
```

> La requête ci-dessus renvoie un JSON structuré comme ceci :

```json
{
  "id": 158,
  "title": "Earth Rise",
  "slug": "earth-rise",
  "description": "Picture taken from the moon",
  "picture": "https://static.demilked.com/wp-content/uploads/2016/11/top-100-photos-most-influential-all-time-5.jpg",
  "likes": 0,
  "createdAt": "2022-02-07T21:15:28.909Z",
  "tags": [],
  "user": { "id": 3, "email": "test91@test.com", "avatar": null }
}
```

Ce endpoint permet de récupérer un post spécifique, via son ID.

### Requête HTTP

`GET http://example.com/kittens/<ID>`

* v2 (courante) : `GET https://album-api.benoithubert.me/api/v2/posts/<ID>`
* v1 (_legacy_) : `GET https://album-api.benoithubert.me/api/posts/<ID>`

### Paramètres d'URL

Paramètre | Description
--------- | -----------
ID        | ID du post à récupérer

## Créer un post

> Remplacez JWT par votre token :

```shell
curl "https://album-api.benoithubert.me/api/v2/posts" \
  -k \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT" \
  -d '{"title":"Glacier","description":"Shot in Iceland","picture":"https://i.imgur.com/PpD4G4N.jpeg","tags":"landscape,glacier"}'
```

```javascript
const payload = {
  title: 'Glacier',
  description: 'Shot in Iceland',
  picture: 'https://i.imgur.com/PpD4G4N.jpeg',
  tags: 'landscape,glacier',
};
fetch('https://album-api.benoithubert.me/api/v2/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT}`
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(post => { /* success! post is the created post */ })
```

> La requête ci-dessus renvoie un JSON structuré comme ceci :

```json
{
  "title": "Glacier",
  "slug": "glacier",
  "description": "Shot in Iceland",
  "picture": "https://i.imgur.com/PpD4G4N.jpeg",
  "tags": [
    { "title": "landscape", "slug": "landscape", "id": 1 },
    { "title": "glacier", "slug": "glacier", "id": 2 }
  ],
  "id": 164,
  "likes": 0,
  "createdAt": "2022-02-08T05:16:52.977Z",
  "userId": 3
}
```

Ce endpoint permet d'enregistrer un nouveau post.

### Requête HTTP

* v2 (courante) : `POST https://album-api.benoithubert.me/api/v2/posts`
* v1 (_legacy_) : `POST https://album-api.benoithubert.me/api/posts`

<aside class="warning">La version v1 ne requiert pas de JWT. En revanche, le post ne sera associé à aucun utilisateur.</aside>

### Champs du corps de requête

Champ       | Requis | Description
----------- | ------ | -----------
title       | oui    | Titre du post
description | non    | Description du post
picture     | oui    | URL de l'image
tags        | non    | Tags - chaîne (`"tag1,tag2"`) ou tableau de chaînes (`["tag1","tag2"]`)

### Codes de retour HTTP

* `201` : succès
* `400` : champ(s) manquant(s) ou invalides
* `401` : JWT invalide ou expiré

## Supprimer un post

> Remplacer ID par l'ID du post, JWT par votre token :

```shell
curl "https://album-api.benoithubert.me/api/v2/posts/ID" \
  -k \
  -X DELETE \
  -H "Authorization: Bearer JWT"
```

```javascript
fetch(`https://album-api.benoithubert.me/api/v2/posts/${ID}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT}`
  }
})
  .then(res => res.text()) // Don't attempt to parse JSON
  .then(() => { /* NOTHING is returned */ })
```

> La requête ci-dessus ne renvoie aucune donnée

Ce endpoint permet de supprimer un post. **Il nécessite le passage d'un JWT** dans le header `Authorization`.

**De plus**, seul l'utilisateur qui a créé le post peut le supprimer.

### Requête HTTP

`DELETE https://album-api.benoithubert.me/api/v2/posts/<ID>`

### Paramètres d'URL

Paramètre | Description
--------- | -----------
ID        | ID du post à récupérer

### Codes de retour HTTP

* `200` : Succès
* `401` : JSON Web Token invalide ou expiré
* `403` : Non autorisé (post appartenant à un autre utilisateur)

## Liker un post

> Remplacer ID par l'ID du post, JWT par votre token :

```shell
curl "https://album-api.benoithubert.me/api/v2/posts/ID/like" \
  -k \
  -X PUT \
  -H "Authorization: Bearer JWT"
```

```javascript
fetch(`https://album-api.benoithubert.me/api/v2/posts/${ID}/like`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT}`
  }
})
  .then(res => res.json())
  .then(post => { /* post has an updated value of likes */ })
```

> La requête ci-dessus renvoie un JSON structuré comme ceci :

```json
{
  "id": 169,
  "title": "Glacier",
  "slug": "glacier",
  "description": "In Iceland",
  "picture": "https://i.imgur.com/PpD4G4N.jpeg",
  "likes": 3,
  "createdAt": "2022-02-08T05:36:19.881Z",
  "tags": [
    { "id": 1, "title": "landscape", "slug": "landscape" },
    { "id": 2, "title": "glacier", "slug": "glacier" }
  ],
  "user": { "id": 3, "email": "test91@test.com", "avatar": null }
}
```

Ce endpoint permet de "liker" un post. **Il nécessite le passage d'un JWT** dans le header `Authorization`.

Il est tout à fait permis de "liker" un post créé par un autre utilisateur.

### Requête HTTP

`PUT https://album-api.benoithubert.me/api/v2/posts/<ID>/like`

### Paramètres d'URL

Paramètre | Description
--------- | -----------
ID        | ID du post à liker

### Codes de retour HTTP

* `200` : Succès
* `401` : JSON Web Token invalide ou expiré
