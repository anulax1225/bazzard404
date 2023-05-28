# **BAZZARD 404**

## Résumer
Il s'agit d'un site web de forum et de chat<br>
totalement écris en javascript en utilisant node js comme interprêteur<br>
et en utilisant comme framwork principal express.

## Prérequis
Le Bazzard utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main.
Puis il faudra mettre le lien de connection à votre base de donnée dans /config/database.js
```javascript
    module.exports = {
    database: 'mongodb://IP_base_de_donner:PORT/nom_base_de_donner'
    }
```

## Commandes
Comamnde à tapez dans git bash pour lancer le Bazzard 404 sur son ordinateur.
```bash
    git remote add origin "https://git.s2.rpn.ch/AmbigapathyV/sitewebroom.git"
    git pull origin main
    npm install
    npm run dev
```
