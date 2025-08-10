# 🎨 Anything Ipsum - Figma Plugin

Plugin Figma qui permet de générer du lorem ipsum thématique directement dans vos designs en utilisant l'API Mistral AI.

## 🚀 Fonctionnalités

- ✨ Génération de lorem ipsum thématique (pirate, espace, cuisine, etc.)
- 🎯 Interface utilisateur intégrée à Figma
- 📝 Création automatique de text nodes ou remplacement du texte sélectionné
- ⚡ Connexion directe à votre backend Anything Ipsum

## 🛠️ Développement

### Build du plugin
```bash
# Build de production
npm run build:figma
# ou
nx build figma-plugin

# Build de développement (non minifié)
npm run build:figma:dev
# ou
nx dev figma-plugin
```

### Installation dans Figma
1. Ouvrez Figma
2. Allez dans Plugins > Development > Import plugin from manifest...
3. Sélectionnez le fichier `dist/figma-plugin/manifest.json`

## 📁 Structure

```
figma-plugin/
├── src/
│   ├── main.ts          # Code principal du plugin
│   └── ui.html          # Interface utilisateur
├── manifest.json        # Configuration du plugin
├── build-plugin.js      # Script de build personnalisé
└── project.json         # Configuration Nx
```

## ⚙️ Configuration

Le plugin se connecte par défaut à `http://localhost:4000/api/generate-lorem`. 
Assurez-vous que votre backend Anything Ipsum est en cours d'exécution.

## 🔧 Dépendances

- `@figma/plugin-typings` : Types TypeScript pour l'API Figma
- `esbuild` : Bundler rapide pour le JavaScript

## 📝 Utilisation

1. Lancez votre backend Anything Ipsum : `npm run start:prod`
2. Ouvrez le plugin dans Figma
3. Saisissez un thème (ex: "pirate", "espace", "cuisine")
4. Choisissez le nombre de paragraphes
5. Cliquez sur "Generate Lorem Ipsum"
6. Le texte est automatiquement inséré dans votre design !
