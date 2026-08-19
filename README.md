# Template simple — Formulaire de commande WhatsApp (KilioraLabs)

Version allégée : pas de fiche produit ni de photo, juste le formulaire avec les informations nécessaires pour livrer la commande. Le client tape lui-même le nom du produit, le total se calcule en temps réel, et un clic ouvre WhatsApp avec la commande déjà rédigée.

## Personnaliser pour un nouveau client

Tout se passe dans **`script.js`**, en haut du fichier, dans l'objet `STORE` :

```js
const STORE = {
  name: "Nova Beauty",
  tagline: "...",
  whatsapp: "2250700000000",   // format international sans "+"
  currency: "FCFA",
  primaryColor: "#16a34a",
  defaultUnitPrice: 15000,     // prix pré-rempli, modifiable par le client
  depositNote: "...",          // note affichée si "Dépôt pour validation" est choisi
  logoUrl: "logo.png"          // facultatif — voir ci-dessous
};
```

Aucune autre modification n'est nécessaire.

### Ajouter un logo

1. Place le fichier image (ex. `logo.png`, idéalement carré, format PNG/JPG/SVG) à la racine du repo, à côté d'`index.html`.
2. Dans `STORE`, renseigne `logoUrl: "logo.png"` (ou une URL complète type `"https://.../logo.png"`).
3. Laisse `logoUrl: ""` si tu ne veux pas de logo — seul le nom de la boutique s'affiche, comme avant.

Le logo apparaît dans l'en-tête, à côté du nom de la boutique. Si l'image ne charge pas (mauvais chemin, fichier manquant), elle est automatiquement masquée pour ne pas casser l'affichage.

### Paiement

Le client effectue un **dépôt de validation**, puis paie **le reste à la livraison**.

Le formulaire propose trois moyens de paiement pour le dépôt :
- Orange Money : **07 67 33 67 80**
- MTN Money : **05 02 56 04 03**
- Wave : **05 02 56 04 03**

Le numéro correspondant s'affiche automatiquement sous le moyen sélectionné.

## Champs du formulaire

- Numéro WhatsApp
- Produit souhaité (texte libre), prix unitaire, quantité, taille/couleur (optionnels)
- Commune/ville, adresse / lieu précis avec quartier et repère
- Moyen de paiement du dépôt
- Dépôt de validation, reste payé à la livraison
- Commentaire (optionnel)
- Total calculé en temps réel + bouton « Commander sur WhatsApp »
- Une indication juste au-dessus du bouton demande d'envoyer une capture d'écran du paiement après le dépôt

## Déploiement GitHub Pages

1. Pousse le dossier sur un repo GitHub.
2. Repo → Settings → Pages → Branch: `main` → Save.
3. Le site est en ligne à `https://<utilisateur>.github.io/<repo>/`.

## Structure

```
index.html
style.css
script.js
README.md
```
