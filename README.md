# **BAZZARD 404**

## Résumer
Le

## Fonctionnement
Il est totalement écris en javascript en utilisant node js comme interprêteur côté serveur.<br>
En utilisant comme framwork principal express qui permets de créer diverse application web. 


Le site web stock toute les données dans une base MongoDB,<br> 
comme les utilisateurs, les articles que postent les utilisateurs, 
les rooms de chats et leurs messages.<br>
Les mots de passe des utilisateur sont hashé avant d'être envoie dans la base de donnée.



## Installation du Bazzard 404
### Prérequis
* Le Bazzard 404 utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main.
Puis il faudra modifier le fichier /config/database.js pour mettre le lien de connection à votre base de donnée. 
```javascript
    module.exports = {
    database: 'mongodb://IP_base_de_donner:PORT/nom_base_de_donner'
    }
```
* Il faut aussi installé node js pour pouvoir installer le packet avec npm et pouvoir lancer le serveur,<br> 
voici le lien pour pouvoir installer [node js](https://nodejs.org/en) (il est conseillé d'installer la version LTS car elle est supporté à long terme).

### Commandes installation du serveur
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
Mais avant de pouvoir créer un utilisateur il vous faudra des jetons d'access<br>
qui peuvent être obtenu en 
