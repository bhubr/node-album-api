# Erreurs

L'API Album utilise les codes d'erreur suivants.


Code d'erreur | Signification
---------- | -------
400 | Bad Request -- Votre requête est invalide (par ex. champs manquants ou incorrects).
401 | Unauthorized -- Vos identifiants ou votre JWT sont incorrects.
403 | Forbidden -- Vous n'avez pas le droit d'effectuer cette opération.
404 | Not Found -- Le post spécifié n'a pas été trouvé.
410 | Conflict -- L'adresse e-mail a déjà été enregistrée dans la base de données.
500 | Internal Server Error -- Le serveur a rencontré un problème. Contactez l'auteur !
502 | Bad Gateway -- Le serveur est indisponible. Contactez l'auteur !
