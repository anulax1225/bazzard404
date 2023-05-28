# **BAZZARD 404**

## Résumer
Le

## Fonctionnement
Il est totalement écris en javascript en utilisant node js comme interprêteur côté serveur.<br>
En utilisant comme framwork principal express qui permets de créer diverse application web. 


Le site web stock toute les données dans une base MongoDB, 
comme les utilisateurs, les articles que postent les utilisateurs, 
les rooms de chats et leurs messages.<br>
Les mots de passe des utilisateur sont hashé avant d'être envoie dans la base de donnée.



## Installation du Bazzard 404
### Prérequis
Le Bazzard 404 utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main.
Puis il faudra modifier le fichier /config/database.js pour mettre le lien de connection à votre base de donnée. 
```javascript
    module.exports = {
    database: 'mongodb://IP_base_de_donner:PORT/nom_base_de_donner'
    }
```

### Commandes
Comamnde à tapez dans git bash pour lancer le Bazzard 404 sur son ordinateur.
```bash
    git remote add origin "https://git.s2.rpn.ch/AmbigapathyV/sitewebroom.git"
    git pull origin main
    npm install
    npm run dev
```
