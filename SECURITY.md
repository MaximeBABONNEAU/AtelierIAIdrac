# Securite — AI Marketing Academy

## Vue d'ensemble

Ce projet est publie sur GitHub Pages (statique). Les protections appliquees :

### 1. Domain Lock (`js/app.js`)

L'application refuse de demarrer si elle n'est pas servie depuis un domaine autorise :

```js
var ALLOWED_HOSTS = ['maximebabonneau.github.io', 'localhost', '127.0.0.1', '0.0.0.0'];
```

Toute personne qui clone le projet et l'heberge ailleurs (ou tente d'embarquer dans une iframe sur un autre domaine) verra :

> Acces restreint — Cette application est reservee aux etudiants de IDRAC Business School

Pour ajouter un domaine autorise, editez `ALLOWED_HOSTS` dans `js/app.js`.

### 2. Inscription publique desactivee

`CONFIG.disablePublicRegistration = true` (dans `js/app.js`).

Le bouton "Creer un compte" est masque, et toute tentative POST est rejetee.
Les comptes etudiants sont crees par l'admin uniquement via le panel admin (onglet Comptes).

### 3. Regles Firebase Realtime Database

**ETAPE IMPORTANTE A FAIRE A LA MAIN :** copiez le contenu de `firebase-rules.json` dans la Console Firebase pour activer les regles serveur.

#### Procedure

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Selectionner le projet `idrac-ai-academy`
3. Menu de gauche : **Realtime Database** > onglet **Rules**
4. Supprimer le contenu actuel
5. Coller le contenu complet de `firebase-rules.json` (juste l'objet JSON, sans les commentaires `_comment` si l'editeur les refuse)
6. Cliquer sur **Publier** (Publish)

Ces regles :
- Bloquent tout chemin non explicitement autorise (`$other` = read/write false)
- Valident la structure des donnees ecrites (types, longueurs max, format des cles)
- Limitent les valeurs numeriques (anti-tricheur XP)
- Empechent la mass-suppression accidentelle

### 4. Hachage des mots de passe

Le hash actuel est basique (DJB2 32-bit). Pour un projet pedagogique court (4 jours, 30 etudiants), c'est suffisant.

Pour aller plus loin (recommande si le projet est reutilise sur le long terme) :
- Migrer vers **Firebase Authentication** (Email/Password ou Anonymous)
- Utiliser **bcrypt** ou **scrypt** cote serveur
- Ajouter un **pepper** dans `hashPass()` et regenerer tous les hashes

## Risques residuels

Sur une app statique servie publiquement :

| Risque | Mitigation actuelle | Mitigation forte |
|--------|---------------------|------------------|
| Embed dans iframe | Domain lock | CSP `frame-ancestors` |
| Clone + rehost | Domain lock | OAuth GitHub pour login |
| Inscription frauduleuse | Public registration OFF | (effectue) |
| Modification XP via Firebase brut | Regles Firebase (`.validate`) | Firebase Auth + custom claims |
| Vol de credentials a l'inscription | Public registration OFF | TLS + bcrypt + 2FA |
| Lecture des donnees etudiants | Regles Firebase (lecture limitee aux paths legitimes) | Firebase Auth + `.read` conditionnel |
| Spam de votes / XP | Regles Firebase (`.validate` numerique) | Rate limiting Cloud Functions |

## Acces officiel

L'unique URL legitime : https://maximebabonneau.github.io/AtelierIAIdrac/

Tout autre acces (port forwarding, miroir, clone perso) est techniquement refuse au lancement.

## Reset des comptes

Si une fuite est suspectee :
1. Connectez-vous en admin
2. Onglet **Comptes** > **Reinitialiser tous les MDP** (nouveau MDP : `idrac2026`)
3. Communiquez le nouveau MDP a chaque etudiant individuellement
4. Optionnel : changer aussi `CONFIG.adminHash` et `CONFIG.classCode` dans `js/app.js`, puis push
