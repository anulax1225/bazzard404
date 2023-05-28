# **BAZZARD 404**
## Résumer
Le Bazzard 404 est un site web de chat en ligne et de forum.<br>
### Access
## Fonctionnement
Il est totalement écris en javascript en utilisant node js comme interprêteur côté serveur.<br>
En utilisant comme framwork principal express qui permets de créer diverse application web. 
Le site web stock toute les données dans une base MongoDB,<br> 
comme les utilisateurs, les articles que postent les utilisateurs, 
les rooms de chats et leurs messages.<br>
Les mots de passe des utilisateur sont hashé avant d'être envoie dans la base de donnée.<br>
## Installation du Bazzard 404
### Prérequis
* Le Bazzard 404 utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main ou dans installer une localement avec l'installeur de [mongoDB](https://www.mongodb.com/try/download/community).
Puis il faudra modifier le fichier /config/database.js pour mettre le lien de connection à votre base de donnée. 
```javascript
    module.exports = {
    database: 'mongodb://IP_base_de_donner:PORT/nom_base_de_donner'
    }
```
* Il faut aussi installé node js pour pouvoir installer le packet avec npm et pouvoir lancer le serveur,<br> 
voici le lien pour pouvoir installer [node js](https://nodejs.org/en) (il est conseillé d'installer la version LTS car elle est supporté à long terme).<br>
### Commandes d'installation du serveur
Comamnde à tapez dans git bash pour lancer le Bazzard 404 sur son ordinateur.
```bash
    git remote add origin "https://git.s2.rpn.ch/AmbigapathyV/sitewebroom.git"
    git pull origin main
    npm install -g nodemon
    npm install
    npm run dev
```
### Création d'un utilisateur
Maintenant que le serveur est lancé il va vous falloir un utilisateur pour pouvoir profité pleinement des services du site.
Mais avant de pouvoir créer un utilisateur il vous faudra des jetons d'access,<br>
ceci son de petites chaînes de caractère aléatoire qui permettent de controllé qui peut créer un utilisateur sur le site.
Pour obtenir des jetons d'access écriver cette commandes dans un nouveau bash shell<br>
```bash
    node StoreNewToken Nb_Jeton_Voulu
```
(si vous refermé votre shell sans noté le resultat ne vous inquièté pas, vos jetons sont accessible depuis votre base de donner dans la collection token).<br>
## TO DO list
---
### Prioritaire
---
### obtionelle
---

