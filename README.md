# Framework de Test API avec Playwright

## 🚀 Configuration de l'authentification

Ce framework utilise un système de setup d'authentification pour stocker les tokens d'accès et les réutiliser dans tous les tests. Il teste l'API Conduit (conduit-api.bondaracademy.com) avec des opérations CRUD sur les articles.

## 📁 Structure du projet

```
api-testing-mastering/
├── playwright.config.ts       # Configuration Playwright
├── package.json              # Dépendances et scripts
├── tests/
│   ├── auth.setup.ts        # Configuration de l'authentification
│   ├── example.spec.ts      # Tests API (CRUD articles)
│   └── helpers/
│       └── api-helper.ts    # Fonctions utilitaires
└── .auth/
    └── user.json            # Token stocké (généré automatiquement)
```

## ⚙️ Installation

```bash
npm install
```

## 🔐 Configuration de l'authentification

1. Créez un fichier `.env` à la racine du projet:
```bash
touch .env
```

2. Ajoutez vos credentials dans le fichier `.env`:
```env
API_BASE_URL=https://conduit-api.bondaracademy.com/api
EMAIL=votre-email@example.com
PASSWORD=votre-mot-de-passe
```

3. Le setup d'authentification s'exécutera automatiquement avant les tests.

## 🎯 Fonctionnement

### 1. Setup d'authentification (`auth.setup.ts`)
- S'exécute avant tous les tests
- Fait une requête POST vers `https://conduit-api.bondaracademy.com/api/users/login`
- Récupère le token d'accès
- Stocke le token dans `.auth/user.json` (storageState)
- Définit `ACCESS_TOKEN` dans les variables d'environnement

### 2. Tests API (`tests/example.spec.ts`)
- Hook `beforeAll` qui affiche l'API Base URL et l'Access Token
- Tests de lecture (GET tags, GET articles)
- Tests de création d'articles (POST)
- Tests de CRUD complets (Create, Read, Update, Delete)
- Utilise automatiquement le storageState pour les requêtes authentifiées

## 🧪 Exécution des tests

```bash
# Lancer tous les tests (setup + tests API)
npm test

# Afficher le rapport HTML
npm run report
```

## 📝 Tests disponibles

### Test: Get tags
- Récupère la liste des tags depuis l'API
- Vérifie que le tag 'Git' existe

### Test: Get articles
- Récupère une liste d'articles (limite: 10)
- Vérifie qu'au moins un article est retourné

### Test: Create an article
- Crée un nouvel article avec un titre, description, body et tags
- Vérifie que l'article est créé avec succès (status 201)

### Test: Create and delete an article
- Crée un article
- Vérifie sa création
- Supprime l'article
- Vérifie qu'il n'existe plus (status 404)

### Test: Update an article
- Crée un article
- Le met à jour avec de nouvelles données
- Vérifie que les modifications sont appliquées
- Nettoie en supprimant l'article

## 📝 Exemple d'utilisation

### Méthode 1: Utilisation directe du request avec storageState

```typescript
test('Test avec authentification automatique', async ({ request }) => {
  // Le storageState est automatiquement chargé
  // Le header Authorization avec le Token est ajouté via playwright.config.ts
  const response = await request.get(`${process.env.API_BASE_URL}/articles`);
  expect(response.ok()).toBeTruthy();
});
```


### Hook beforeAll pour vérifier les variables d'environnement

```typescript
test.beforeAll(async () => {
  console.log('API Base URL:', process.env.API_BASE_URL);
  console.log('Access Token:', process.env.ACCESS_TOKEN);
});
```

## 🔄 Configuration dans playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  
  use: {
    extraHTTPHeaders: {
      // Token automatiquement ajouté à chaque requête
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    },
  },

  projects: [
    // Projet de setup pour l'authentification
    { 
      name: 'setup', 
      testMatch: 'auth.setup.ts' 
    },
    
    // Projet chromium avec authentification
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    
    // Autres navigateurs (firefox, webkit)...
  ],
});
```

## 🔑 Avantages de cette approche

✅ **Authentification une seule fois**: Le token est obtenu une fois et réutilisé  
✅ **Tests plus rapides**: Pas besoin de s'authentifier à chaque test  
✅ **Tests isolés**: Chaque test peut s'exécuter indépendamment  
✅ **Token automatique**: Le header Authorization est ajouté automatiquement  
✅ **Multi-navigateurs**: Tests sur Chromium, Firefox et WebKit  
✅ **Variables d'environnement**: Configuration facile via fichier .env

## 🛠️ Personnalisation

### Modifier l'endpoint d'authentification

Dans [tests/auth.setup.ts](tests/auth.setup.ts):
```typescript
const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  data: { 
    "user": {
      "email": process.env.EMAIL,
      "password": process.env.PASSWORD
    }
  }
});
```

### Modifier le format du token

Dans [playwright.config.ts](playwright.config.ts):
```typescript
extraHTTPHeaders: {
  'Authorization': `Token ${process.env.ACCESS_TOKEN}` // ou 'Bearer' selon votre API
}
```

## 📚 Documentation

- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Authentication](https://playwright.dev/docs/auth)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
