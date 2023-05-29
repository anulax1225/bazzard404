# **BAZZARD 404**

## Résumer
Le Bazzard 404 est un site web de chat en ligne et de forum.<br>

### Autorisation
* Sans avoir log in(si vous n'etes pas enregistré avec un utilisateur valide), vous ne pourez que voir les publications des utilisateurs.
* Si vous etes log in vous pourrez :
    * Créer, edité, supprimé vos articles
    * Entré dans des rooms pour discuté avec des gens
    * Créer une room pour débattre de nouveau sujet

## Installation du Bazzard 404 <br>

### Prérequis
* Le Bazzard 404 utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main ou dans installer une localement avec l'installeur de [mongoDB](https://www.mongodb.com/try/download/community).
Puis il faudra modifier le fichier /config/database.js pour mettre le lien de connection à votre base de donnée : 
```javascript
    module.exports = {
    database: 'mongodb://IP_base_de_donner:PORT/nom_base_de_donner'
    }
```
* Il faut aussi installé node js pour pouvoir installer le packet avec npm et pouvoir lancer le serveur,<br> 
voici le lien pour pouvoir installer [node js](https://nodejs.org/en) (il est conseillé d'installer la version LTS car elle est supporté à long terme).<br>

### Commandes d'installation du serveur
Comamnde à tapez dans git bash pour lancer le Bazzard 404 sur son ordinateur :<br>
```bash
    git remote add origin "https://git.s2.rpn.ch/AmbigapathyV/sitewebroom.git"
    git pull origin main
    npm install -g nodemon
    npm install
    npm run dev
```

### Création d'un utilisateur
Maintenant que le serveur est lancé il va vous falloir un utilisateur pour pouvoir profité pleinement des services du site.
Mais avant de pouvoir créer un utilisateur il vous faudra des **jetons d'access**,<br>
ceci son de petites chaînes de caractère aléatoire qui permettent de controllé qui peut créer un utilisateur sur le site.
Pour obtenir des jetons d'access écriver cette commandes dans un nouveau bash shell :<br>

```bash
    node StoreNewToken Nb_Jeton_Voulu
```
*(si vous refermé votre shell sans noté le resultat ne vous inquièté pas, vos jetons sont accessible depuis votre base de donner dans la collection token)*.<br>

Et voila vous pouvez directement vous connecté en localhost ou en entrant l'addresse IP de votre ordinateur. 

## Fonctionnement
Il est totalement écris en *javascript* en utilisant *node js* comme interprêteur côté serveur.<br>
En utilisant comme framwork principal *express* qui permets de créer diverse application web. 

Le site web stock toute les données dans une base *MongoDB*,<br> 
comme les utilisateurs, les articles que postent les utilisateurs, 
les rooms de chats et leurs messages.<br>
Les mots de passe des utilisateur sont hashé avant d'être envoie dans la base de donnée.<br>
Pour accéder avec javascript à la base de donner j'ai utilisé le framework *mongoose*.

Les templates sont écris en *pug*(*Jade* pour les intimes), puis sont dynamiquement transformé en page *HTML* avant d'être envoié au client.<br>
Le designe du site à été fait à l'aide de *bootstrap*.

Le core du program est dans app.js qui contient la plus part des configuration, la connection a la base de donner, le routage de home et la configuration pour routé toute les autres url depuis **./routes**.  

Tout le site web fonction avec HTTP get, post et ajax delete. Mais pour le chat en live la connection est upgrad a websocket. Et toute la logique pour la connection en websocket se trouvent dans **./consumers**

Il y a plusieur répertoire dans se site qui sont :
* routes : definie tout les urls vers les quels peuvent pointé mon site envoie une response par application.
    * strategy : definie la strategy authentification des requêtes et le generateur de jeton
* public : est le répertoire accessible depuis le client dans le quelle se trouve:
    * bower_components : qui contient bootstrap et ces dépendances.
    * css : qui contient mon css.
    * js : qui contient les fichier javascript qui tourne côté client.
    * img : qui contient les images publique du site(pas les image enregistrer par les utilisateurs).
* templates : qui contient tout les templates des pages du site par application
* models : qui contient tout les models de donner definie pour la base de donné.
* consumers : qui contient le fichier permettant de lancer les chatrooms.
* config : qui contient les diverse configuration pour la base de donner et la strategy de connection local(local c'est à dire un utilisateur sur notre base de donner.).
* SSL : **Il est très déconseiller de réutilisé les certificas SSL or d'un réseau privé ou pour une utilisation public.**


## TO DO liste
---
### Prioritaire
---
* Nettoyé le code (Bien avancé).
* Ajouté un access par compte à la BD.
* Ajouté une interface administrateur.
* Ajouté une interface utilisateur pour gérer ces chatrooms.

### Obtionelle
---
* Pouvoir envoyé des photos dans les chatrooms.
* Créer des chats rooms publique et privées.
* Pouvoir incrusté un article dans une conversation.

## Major Upgrade
1. Creer un article.
1. Ajouté article a la BD.
1. Editer un article.
1. Supprimer un article.
1. Creer des utilisateurs.
1. Creer une strategy local de connection.
1. Lié les articles au utilisateur.
1. Ajouté le hub.
1. Creer des room si on est utilisateur.
1. Entrer dans une room.
1. Voir les messages des autres utilisateurs.
1. Voir les noms d'utilisateur et le temps. 
1. Enregistrer les messages. 
1. Code nettoyé.
1. README.md écris.


