# Générateur de Lorem Ipsum Thématique

Un générateur de lorem ipsum moderne utilisant Angular et l'API Mistral pour créer du texte de remplissage thématique intelligent.

## 🚀 Fonctionnalités

- **Génération thématique** : Créez du lorem ipsum basé sur n'importe quel thème
- **API sécurisée** : Clé API Mistral protégée côté serveur
- **Interface moderne** : Composants Angular avec Tailwind CSS
- **Rate limiting** : Protection contre les abus
- **SSR** : Rendu côté serveur pour de meilleures performances

## 🛠️ Technologies utilisées

- **Frontend** : Angular 20 (standalone components, signals, reactive forms)
- **Backend** : Express.js avec TypeScript
- **IA** : API Mistral pour la génération de texte
- **Styling** : Tailwind CSS
- **Sécurité** : CORS, rate limiting, validation

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd anithing-ipsum
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.exemple .env
   ```
   
   Puis éditer le fichier `.env` et remplacer `your_mistral_api_key_here` par votre vraie clé API Mistral :
   ```env
   MISTRAL_API_KEY=votre_vraie_clé_mistral_ici
   ```

## 🔑 Obtenir une clé API Mistral

1. Aller sur [console.mistral.ai](https://console.mistral.ai/)
2. Créer un compte ou se connecter
3. Aller dans la section "API keys"
4. Créer une nouvelle clé API
5. Copier la clé dans votre fichier `.env`

## 🚀 Démarrage

### Mode développement
```bash
npm start
```
L'application sera disponible sur `http://localhost:4200` (ou un autre port si 4200 est occupé).

### Mode production
```bash
npm run build
npm run serve:ssr:anithing-ipsum
```
L'application sera disponible sur `http://localhost:4000`.

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── components/
│   │   └── lorem-generator.component.ts   # Composant principal
│   ├── services/
│   │   └── lorem.service.ts               # Service pour l'API
│   ├── models/
│   │   └── lorem.models.ts                # Interfaces TypeScript
│   └── app.ts                             # Composant racine
├── server.ts                              # Serveur Express avec API
└── ...
```

## 🔧 Configuration

### Variables d'environnement

- `NODE_ENV` : Mode d'exécution (development/production)
- `MISTRAL_API_KEY` : Clé API pour Mistral
- `PORT` : Port pour le serveur (défaut: 4000)

### Rate limiting

- **Limite** : 50 requêtes par IP toutes les 15 minutes
- **Paramètres modifiables** dans `src/server.ts`

## 🎨 Utilisation

1. **Saisir un thème** : Ex: "pirates", "cuisine française", "espace"
2. **Configurer les paramètres** :
   - Nombre de paragraphes (1-10)
   - Phrases par paragraphe (2-10)
3. **Générer** le texte thématique
4. **Copier** le résultat d'un clic

## 🔒 Sécurité

- **Clé API protégée** : Jamais exposée côté client
- **Validation des données** : Validation stricte des paramètres
- **Rate limiting** : Protection contre les abus
- **CORS configuré** : Origines autorisées définies
- **Sanitisation** : Validation des entrées utilisateur

## 🚢 Déploiement

### Docker (développement)
```bash
docker-compose -f docker-compose.dev.yml up
```

### Docker (production)
```bash
docker-compose -f docker-compose.prod.yml up
```

### Variables d'environnement en production

Assurez-vous de configurer :
- `NODE_ENV=production`
- `MISTRAL_API_KEY=<votre_clé_réelle>`
- `PORT=<port_souhaité>`
- Mettre à jour l'origine CORS dans `server.ts`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Mistral AI](https://mistral.ai/) pour l'API de génération de texte
- [Angular](https://angular.io/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le design
