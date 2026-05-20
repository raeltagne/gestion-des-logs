# Projet de Centralisation de Logs - Freemopay

Ce projet est une application de centralisation de logs conçue pour collecter, stocker et afficher les logs de différentes applications.

## État du Projet

Ce qui a été réalisé :
- **Backend API (NestJS)** :
  - Un endpoint `POST /logs` pour ingérer les logs.
  - Cet endpoint est sécurisé par une clé d'API (`X-API-KEY`).
  - Un endpoint `GET /logs` pour récupérer les logs stockés.
  - Intégration avec ElasticSearch pour le stockage et la recherche.
- **Frontend (React + Vite)** :
  - Un tableau de bord qui affiche les logs en temps réel.
  - Possibilité de filtrer les logs par niveau (`info`, `warning`, `error`).
  - Une option de rafraîchissement automatique.
- **Infrastructure (Docker)** :
  - Une instance d'ElasticSearch et de Kibana prête à l'emploi avec Docker Compose.

## Comment lancer le projet localement

Ce guide simple vous permettra de lancer le projet sur votre machine.

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :
1.  **Node.js** : Vous pouvez le télécharger [ici](https://nodejs.org/).
2.  **Docker Desktop** : Vous pouvez le télécharger [ici](https://www.docker.com/products/docker-desktop/). Assurez-vous qu'il est bien lancé avant de continuer.

### Étapes d'installation

Suivez ces étapes dans l'ordre.

**1. Lancez la base de données (ElasticSearch)**

Ouvrez un terminal à la racine de ce projet et lancez la commande suivante. Cela va télécharger et démarrer la base de données en arrière-plan.

```bash
docker-compose up -d
```

**2. Lancez le serveur Backend**

Dans le même terminal, naviguez vers le dossier du backend et installez ses dépendances.

```bash
cd packages/backend
npm install
```

Une fois l'installation terminée, lancez le serveur backend en mode développement.

```bash
npm run start:dev
```

Le serveur backend est maintenant en cours d'exécution sur `http://localhost:3000`. Laissez ce terminal ouvert.

**3. Lancez l'interface Frontend**

Ouvrez un **nouveau terminal**, et placez-vous à la racine du projet. Naviguez ensuite vers le dossier du frontend et installez ses dépendances.

```bash
cd packages/frontend
npm install
```

Une fois l'installation terminée, lancez le serveur de développement du frontend.

```bash
npm run dev
```

Le tableau de bord est maintenant accessible dans votre navigateur à l'adresse `http://localhost:5173` (le terminal vous donnera l'adresse exacte).

### Comment tester

- **Tableau de bord** : Rendez-vous sur `http://localhost:5173` pour voir les logs.
- **Envoyer un log** : Vous pouvez utiliser un outil comme `curl` ou Postman pour envoyer un nouveau log à l'API.

Exemple avec `curl` (à exécuter dans un terminal) :
```bash
curl -X POST http://localhost:3000/logs \
-H "Content-Type: application/json" \
-H "X-API-KEY: Freemopay-Test-Key-12345" \
-d '{
  "level": "error",
  "message": "Ceci est un log de test depuis curl.",
  "application": "Test-App",
  "source": "CurlCommand",
  "timestamp":"2025-07-21T02:58:51.898Z"
}'
```
exemple sur powerShell
```bash
Invoke-WebRequest -Uri http://localhost:3000/logs `
  -Method POST `
   -Headers @{
     "Content-Type" = "application/json"
     "X-API-KEY" = "Freemopay-Test-Key-12345"
   } `
   -Body '{
     "application": "freemoPay",
     "source": "PowerShellTest",  
     "message": "Ceci est un log de test depuis curl.",
     "level": "warning",
     "timestamp":"2025-09-08T02:58:51.898Z"
   }.'

```

lire dans un fichier de logs

```bash
  
>>  # ?? Chemin du fichier de log
>> $filePath = "C:\Users\SOP TECH\AppData\Roaming\Microsoft\VisualStudio\17.0_044053a0\ActivityLog.xml"
>>
>> # ?? Adresse de ton serveur Elasticsearch
>> $url = "http://localhost:9200"
>> $index = "logs"
>>
>> # ?? Charger le fichier XML
>> [xml]$xml = Get-Content $filePath
>>
>> # ?? Extraire les entrées de log
>> $entries = $xml.SelectNodes("//entry")
>>
>> foreach ($entry in $entries) {
>>     # ?? Déduire le niveau du log
>>     $level = if ($entry.InnerText -match "ERROR") { "error" }
>>              elseif ($entry.InnerText -match "Warning") { "warning" }
>>              else { "info" }
>>
>>     # ?? Construire le document JSON
>>     $body = @{
>>         application = "test-app"
>>         source      = "PowerShell"
>>         message     = $entry.InnerText
>>         level       = $level
>>         timestamp   = (Get-Date).ToString("o")
>>     } | ConvertTo-Json -Depth 3
>>
>>     # ?? Envoyer à Elasticsearch
>>     Invoke-WebRequest -Uri "$url/$index/_doc" `
>>         -Method POST `
>>         -Headers @{ "Content-Type" = "application/json" } `
>>         -Body $body
>> }
>>
```
creer un user
```bash
Invoke-WebRequest -Uri http://localhost:3000/users `
  -Method POST `
   -Headers @{
     "Content-Type" = "application/json"
     "X-API-KEY" = "Freemopay-Test-Key-12345"
   } `
   -Body '{
     "name": "USER",
     "surname": "user",
     "username": "user",
     "password": "myPwd123",
     "role": "admin",
     "email": "raeitagne@gmail.com",
     "number":690618557,
     "etat":"actif"
   }'

```
creer une application
```bash
Invoke-WebRequest -Uri http://localhost:3000/applications `
  -Method POST `
   -Headers @{
     "Content-Type" = "application/json"
     "X-API-KEY" = "Freemopay-Test-Key-12345"
   } `
   -Body '{
     "name": "VisualStudio"
   }'

```

```bash
Invoke-WebRequest -Uri http://localhost:3000/logs `
  -Method POST `
   -Headers @{
     "Content-Type" = "application/json"
     "X-API-KEY" = "Freemopay-Test-Key-12345"
   } `
   -Body '{
     "application": "freemopay-dashboard",
     "source": "PowerShellTest",
     "message": "service indisponible.",
     "level": "warnig"
   }'

```
Après avoir exécuté cette commande, rafraîchissez le tableau de bord (ou attendez le rafraîchissement automatique) : votre nouveau log devrait apparaître !

## Scénario de Test Détaillé

Voici un scénario complet pour vérifier que toutes les parties du projet communiquent correctement.

### Étape 1 : Vérifier la sécurité (Échec attendu)

Essayez d'envoyer un log **sans** la clé d'API.

```bash
curl -X POST http://localhost:3000/logs \
-H "Content-Type: application/json" \
-d '{
  "level": "info",
  "message": "Tentative de log sans clé API",
  "application": "Security-Test",
  "source": "Curl"
}'
```
**Résultat attendu :** Une erreur `401 Unauthorized`. Cela prouve que l'API est bien sécurisée.

### Étape 2 : Envoyer des logs valides

Maintenant, envoyons des logs avec la bonne clé d'API.

**Log d'erreur :**
```bash
curl -X POST http://localhost:3000/logs \
-H "Content-Type: application/json" \
-H "X-API-KEY: Freemopay-Test-Key-12345" \
-d '{
  "level": "error",
  "message": "Le paiement a échoué pour la transaction XYZ",
  "application": "Payment-API",
  "source": "PaymentService"
}'
```

**Log d'information :**
```bash
curl -X POST http://localhost:3000/logs \
-H "Content-Type: application/json" \
-H "X-API-KEY: Freemopay-Test-Key-12345" \
-d '{
  "level": "info",
  "message": "L'utilisateur admin vient de se connecter",
  "application": "WebApp-Auth",
  "source": "LoginController"
}'
```
**Résultat attendu :** Une confirmation `{"status":"ok","message":"Log indexed"}` pour chaque commande.

### Étape 3 : Vérifier le tableau de bord

Ouvrez votre navigateur et allez sur `http://localhost:5173`.

1.  Les deux logs (`Le paiement a échoué...` et `L'utilisateur admin...`) doivent apparaître.
2.  Utilisez le filtre "Filter by level" pour vérifier que le filtrage par `error` et `info` fonctionne.

### Étape 4 (Optionnel) : Vérifier dans Kibana

1.  Allez sur `http://localhost:5601`.
2.  Créez une "Data View" (ou "Index Pattern") avec le nom `logs-*`.
3.  Allez dans `Analytics > Discover` pour voir les données brutes.



creer un user
```bash
Invoke-WebRequest -Uri http://localhost:3000/personnels `
  -Method POST `
   -Headers @{
     "Content-Type" = "application/json"
   } `
   -Body '{
     "nom": "thala",
     "prenom": "rael",
     "mot_passe": "12345",
     "role": "admin",
     "telephone":"690618557"
   }'