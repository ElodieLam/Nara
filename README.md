# Nara
Projet Génie Logiciel 5A Polytech Paris-Sud

## Sujet

L'objectif de ce projet est de répondre aux besoins d'un client désirant un intranet de gestion des notes de frais et congés des collaborateurs de son entreprise. 

## Installation
(Windows seulement)

### Partie base de données

#### Etape 1
Télécharger XAMPP v. 5.6.40 / PHP 5.6.40 :
<a href="https://www.apachefriends.org/fr/download.html" target="_blank">`https://www.apachefriends.org/fr/download.html`</a>

#### Etape 2
Installer XAMPP.

#### Etape 3
Lancer le module MySQL ("Start" dans XAMPP).

#### Etape 4
Dans C:\xampp\phpMyAdmin\config.inc.php, modifier :
```shell
$cfg['Servers'][$i]['auth_type'] = 'config';
```
En
```shell
$cfg['Servers'][$i]['auth_type'] = cookie;
```
Et :
```shell
$cfg['Servers'][$i]['password'] = '';
```
En
```shell
$cfg['Servers'][$i]['password'] = 'password';
```
### Partie back-end

#### Etape 1
Télécharger Node.js sur le lien : 
<a href="https://nodejs.org/en/download/" target="_blank">`https://nodejs.org/en/download/`</a><br>
Installer Node.js
#### Etape 2
Installer npm
```shell
npm install -g npm@latest
```
#### Etape 3
Installer Angular
```shell
npm install -g @angular/cli@latest
npm i -g @angular-devkit/core typescript
```

## Mise en place 

### Création de la base de données

Aller sur http://localhost/phpmyadmin/<br>
Cliquer sur nouvelle base de données avec comme nom : 'nara_database' (utf8mb4_bin)<br>
Importer : Nara/Database/nara_database.sql<br>
Exécuter 

### back-end

Ouvrir un terminal sur Nara/back-end/
```shell
$ node server.js 
```
Tous les ports doivent s'afficher.

### front-end

Ouvrir un terminal sur  Nara/front-end/
```shell
npm install i @angular-devkit/build-angular
ng serve -o
```

## Verion mobile 

### Version simple
Lorsque le programme est lancé, cliquer dans le navigateur web sur examiner l'élément, <br>
passer en mode téléphone et recharger la page.

### Version complexe
Trouver l’adresse IP locale de la machine sur le réseau :
```shell
ipconfig
```
Vous obtenez l'adresse de votre machine sur votre réseau.<br>
Par exemple : 192.168.1.26<br>
Changer dans tous les fichiers de Nara/front-end/src/app/xx/xxx.service.ts
```typescript
url = 'http://localhost:3000';
```
En
```typescript
url = 'http://192.168.1.26:3000';
```
Relancer Angular :
```shell
ng serve --host 192.168.1.26
```
Vous pouvez maintenant accéder au projet en faisant : http://192.168.1.26:4200/ sur les machines du même réseau.


