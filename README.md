# Utopix

Site vitrine bilingue (FR/EN) pour Utopix, l'habitation-sculpture de Sainte-Énimie
(Causse de Sauveterre, Lozère). Next.js (App Router) + Prisma + MySQL. Les textes de
chaque section et les images de diaporama sont stockés en base et modifiables via
une interface d'administration interne.

## Stack

- Next.js 16 (App Router, Turbopack)
- next-intl pour le routage `/fr` / `/en`
- Prisma 7 + MySQL (adapter `@prisma/adapter-mariadb`)
- Authentification admin par cookie de session signé (JWT via `jose`)
- Images uploadées sur disque local (`public/uploads`)

## Configuration

1. Copier les variables d'environnement et les renseigner dans `.env` :
   - `DATABASE_URL` : chaîne de connexion MySQL, ex.
     `mysql://user:password@host:3306/utopix`
   - `ADMIN_SESSION_SECRET` : déjà généré, à changer en production si besoin
   - `SEED_ADMIN_EMAIL` : email du premier compte admin créé par le seed

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Créer les tables et générer le client Prisma :

   ```bash
   npm run db:migrate
   ```

4. Injecter le contenu initial (8 sections FR/EN + un compte admin) :

   ```bash
   npm run db:seed
   ```

   Le mot de passe du compte admin est généré aléatoirement et affiché une seule
   fois dans la console à la fin du seed — à changer après la première connexion.

5. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

   - Site public : http://localhost:3000/fr ou /en
   - Administration : http://localhost:3000/admin/login

## Gérer le contenu

Chaque section (Histoire, Construction, Extérieur(s), Intérieur(s), Peintures,
Sculptures, Infos - Extras, Accès - Contact) + la page d'accueil sont éditables
depuis `/admin` :

- Titre et texte (FR/EN), un paragraphe par ligne vide
- Images du diaporama : ajout, suppression, réordonnancement, texte alternatif
  FR/EN

Les slugs des pages sont définis dans `src/lib/page-slugs.ts` — c'est aussi ce
qui pilote l'ordre et les libellés du menu (`src/messages/fr.json` et
`en.json`).

Les textes injectés par `prisma/seed.ts` sont des textes de démarrage à
remplacer par le contenu réel via l'admin.

## Autres commandes

```bash
npm run db:studio    # interface Prisma pour explorer/éditer la base directement
npm run build        # build de production
npm run lint         # ESLint
```
