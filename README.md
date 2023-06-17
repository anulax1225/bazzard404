# **BAZZARD 404**

## Résumer
Le Bazzard 404 est un site web de chat en ligne et de forum.<br>
Disponible librement pour permettre une alternative au application classique de chat.<br>

### Possibilité
* Sans avoir log in(si vous n'etes pas enregistré avec un utilisateur valide), vous ne pourez que voir les publications des utilisateurs.
* Si vous etes log in vous pourrez :
    * Créer, edité, supprimé vos articles
    * Entré dans des rooms pour discuté avec des gens
    * Créer des rooms en public ou privé selon votre envie et créer une whitelist pour celle-ci.
    * Vous aurez aussi access à un espace utilisateur nommé **User Profile**<br>
    qui vous donne access facilement à un sommaire de vos activité sur le site


## Installation du Bazzard 404 <br>

### Prérequis
* Le Bazzard 404 utilise une base de donné mongoDB, il est donc neccessaire dans avoir une apporté de main ou dans installer une localement avec l'installeur de [mongoDB](https://www.mongodb.com/try/download/community), il est aussi conseillé d'installé mongo shell dans le même onglet pour pouvoir faire les manipulations qui suivent.
Une fois le serveur en place, vous créez une base de donnée pour le site et un utilisateur pour pouvoir vous connectez à la base de donnée.
Tapez ces commandes dans mongo shell après vous être connectez au serveur :
```javascript
    use bazzard404
    use admin
    db.createUser({ user:"Nom_utilisateur", pwd: "mot_passe", roles: [{ role: "readWrite", db: "bazzard404"  }] })
```
Vous devez aussi aller modifier le fichier /mongodb/server/6.0/bin/mongod.cfg
```text
    #security:
    #||
    #\/
    security:
        authentification: "enabled"
```
Puis il faudra modifier le fichier /config/database.js pour mettre le lien de connection à votre base de donnée : 
```javascript
    module.exports = {
    database: 'mongodb://nom_utilisateur:mot_passe@IP_base_de_donner:PORT/bazzard404'
    }
```
* Il faut aussi installé node js pour pouvoir installer le packet avec npm et pouvoir lancer le serveur,<br> 
voici le lien pour pouvoir installer [node js](https://nodejs.org/en) (il est conseillé d'installer la version LTS car elle est supporté à long terme).<br>

### Commandes d'installation du serveur
Comamnde à tapez dans git bash pour lancer le Bazzard 404 sur son ordinateur :<br>
```bash
    mkdir Bazzard404
    cd Bazzard404
    git init --initial-branch=main
    git remote add origin "https://github.com/anulax1225/bazzard404.git"
    git pull origin main
    npm run loadConfig
    npm run start
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

Et voila vous pouvez directement vous connecté en localhost ou en entrant l'addresse IP de votre ordinateur et découvrir le site. 

## Fonctionnement

### Farmeworks
Il est totalement écris en *javascript* en utilisant *node js* comme interprêteur côté serveur.<br>
En utilisant comme framwork principal *express* qui permets de créer diverse application web. 

Le corp du program est dans app.js qui contient la plus part des configuration général du serveur, la connection à la base de donner, le routage de home et la configuration pour routé toute les autres url utiliser par le site.

Les templates sont écris en *pug*(*Jade* pour les intimes), puis sont dynamiquement transformé en page *HTML* avant d'être envoié au client.<br>
Le designe du site à été fait à l'aide de *bootstrap*. 

L'authentification d'une session se fait avec *passport* un autre module disponible avec *node js*. 

Le site web stock toute les données dans une base *MongoDB*,
comme les utilisateurs, les articles que postent les utilisateurs, 
les rooms de chats et leurs messages.<br>
Les mots de passe des utilisateur sont hashé avant d'être envoie dans la base de donnée.<br>
Pour accéder avec javascript à la base de donner j'ai utilisé le framework *mongoose*.

Tout le site web fonction avec HTTP get, post et ajax delete. Mais pour le chat en live la connection est upgrad a websocket. Et toute la logique pour la connection en websocket se trouvent dans **./consumers/chatConsummer**.

La connexion est en *HTTPS* et est établie avec avec des certificate auto signé, un rootCA directement disponible sur le site permettant de l'ajouté au certifica autorisé par votre navigateur. Celui-ci permets authantifier le certifica du serveur.
L'autre certifica est celui du serveur permettant d'etablir la connexion en *HTTPS* avec le client. Cette methode n'est pas la plus sur, mais permet une inplémentation simple de *l'HTTPS*.

### Répertoire
Vous trouverez plusieur répertoire avec différente utilité:

* routes : definie tout les urls vers les quels peuvent pointé mon site envoie une response par application.
    * strategy : definie la strategy authentification des requêtes et le generateur de jeton

* public : est le répertoire accessible depuis le client dans le quelle se trouve:
    * bower_components : contient bootstrap et ces dépendances(don't jquery).
    * css : contient mon css.
    * js : contient les fichier javascript qui tourne côté client.
    * img : contient les images publique du site(pas les image enregistrer par les utilisateurs).
    * SSL : contient le certifica autosigné RootCA

* templates : contient tout les templates des pages du site par application
* models : contient tout les models de donner definie pour la base de donné.
* consumers : contient le fichier permettant de lancer les chatrooms.
* config : contient les diverse configuration pour la base de donner et la strategy de connection local(local c'est à dire un utilisateur sur notre base de donner.).
* SSL : contient les certificate SSL neccessaire à une connexion en https<br> 
**Il est très déconseiller de réutilisé ces certificas SSL or d'un réseau privé ou pour une utilisation réelle, ceci ne servent que d'exemple.**

### Autorisation 

Il exist plusieur type d'accessait au site :
* Non-authentifier : Accessait lecture des articles.
* Utilisateur : Accessait de creation, edition et supprésion de ses articles, 
    creation de room et possibilité d'aller discuté dans les rooms. Accessait à son profile utilisateur.
* Administrateur : Accessait au au profile de tout les utilisateurs, accessait a toute les chats rooms.

## TO DO liste

### Prioritaire
---
* Filtrer les inputs utilisateurs.
* Empêché les injections de base de donnée.
* Empêché les injections pug et javascript.
* Réparer add articles.
* Ajouté une interface utilisateur pour gérer ces chatrooms.
* Nettoyé le code (Bien avancé).

### Annexe
---
* Pouvoir envoyé des photos dans les chatrooms.
* Pouvoir incrusté un article dans une conversation.
* Ajouté une interface administrateur.
* Creer un service minecract à volonté.🃏
* Creer un service VOIP.

## Ajout

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
1. Interface vision des données utilisateurs pour les utilisateurs.
1. Ajouté un access par compte à la BD.
1. Ajouté des fonctions asynchrones pour query la base de donnée.
1. Créer des chats rooms publique et privées.

