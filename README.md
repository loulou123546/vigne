# DASH-b

![node version](https://img.shields.io/badge/node-&#10878;8-green.svg)
![npm version](https://img.shields.io/badge/npm-&#10878;3.8.6-green.svg)
![ISC license](https://img.shields.io/badge/licence-ISC-blue.svg)

![logo](https://raw.githubusercontent.com/loulou123546/vigne/master/assets/logo-name.png)

## Présentation

A l'aide d'un simple Tableau de bord, vous accéder à l'ensemble de vos besoins en terme de rendement, gestions des risques de maladies et de comparaison inter-parcelle

| &nbsp; | &nbsp; | &nbsp; |
|:---:|:---:|:---:|
|<img src="https://cdn.discordapp.com/attachments/485131840814972928/485751973308792833/unknown.png" width="30%" style="float:left;width:30%;">|
<img src="https://cdn.discordapp.com/attachments/485131840814972928/485752001083211777/unknown.png" width="30%" style="float:left;width:30%;">|
<img src="https://cdn.discordapp.com/attachments/485131840814972928/485752045702217728/unknown.png" width="30%" style="float:left;width:30%;">|


## Technologies utilisées

* Node.JS
* Express, express-session, express-cookie, ...
* HTML5, w3.css, font-awesome
* Une table plastique de 3,2m par 1m

## Installation

* `npm init`
* `npm run dev`
* `http://localhost:8080/`

Créer le fichier database-local.json avec ces informations de base de données.

Exécuter le script mysql situé dans `config/vigne.sql`.

Peupler la base de données via la commandes suivantes :
* `npm run populate`

## Routes

* /parcel/[pid]
* /parcel/add
* /parcel/[pid]/edit
* /parcel/[pid]/delete
* /observation/add
* /observation/[pid]/edit
* /observation/[pid]/delete
* /social
* /socialData
* /alerts
* /alertData
