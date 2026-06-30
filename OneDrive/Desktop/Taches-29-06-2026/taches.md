# Tâches du jour — 29/06/2026

## 📋 À faire

- [ ] Montage vidéo
- [ ] Réflexion BTS SIO
- [ ] Développement AM

## ✅ Terminé

---

## Pseudo-code — Algorithme de la page Todo

### Structure des données

```
CONSTANTE STORAGE_KEY = "taches-29-06-2026"

CONSTANTE DEFAULT_TASKS = [
  { id, texte: "Montage vidéo",     fait: false },
  { id, texte: "Réflexion BTS SIO", fait: false },
  { id, texte: "Développement AM",  fait: false }
]

VARIABLE taches  = charger depuis localStorage (ou DEFAULT_TASKS)
VARIABLE filtre  = "toutes"  // "toutes" | "à_faire" | "terminées"
```

---

### Initialisation

```
FONCTION init :
  dateDisplay ← date du jour formatée en français
  APPELER render()
```

---

### Ajouter une tâche

```
FONCTION ajouterTache :
  texte ← valeur du champ input (sans espaces inutiles)

  SI texte est vide ALORS
    afficher erreur visuelle sur le champ
    RETOURNER

  créer objet { id: uid(), texte, fait: false }
  insérer en tête de taches[]
  vider le champ input
  APPELER sauvegarder()
  APPELER render()
```

---

### Cocher / décocher une tâche

```
FONCTION basculerTache(id) :
  tache ← taches.trouver(t => t.id == id)
  tache.fait ← NON tache.fait
  APPELER sauvegarder()
  APPELER render()
```

---

### Supprimer une tâche

```
FONCTION supprimerTache(id) :
  element ← DOM.querySelector([data-id=id])
  ajouter classe CSS "removing" à element  // déclenche animation fadeOut
  
  QUAND animation terminée :
    taches ← taches.filtrer(t => t.id ≠ id)
    APPELER sauvegarder()
    APPELER render()
```

---

### Filtrer les tâches

```
FONCTION changerFiltre(valeur) :
  filtre ← valeur
  mettre à jour bouton actif visuellement
  APPELER render()
```

---

### Rendu de la liste

```
FONCTION render() :
  visibles ← taches.filtrer selon filtre actif :
    SI filtre == "à_faire"    → garder taches où fait == false
    SI filtre == "terminées"  → garder taches où fait == true
    SINON                     → garder toutes

  vider taskList

  SI visibles est vide ALORS
    afficher emptyState
  SINON
    POUR CHAQUE tache dans visibles :
      APPELER créerElement(tache)
      ajouter à taskList

  APPELER mettreAJourProgression()
```

---

### Barre de progression

```
FONCTION mettreAJourProgression() :
  total    ← taches.longueur
  terminés ← taches.compter(t => t.fait == true)
  pct      ← SI total == 0 ALORS 0 SINON arrondi(terminés / total * 100)

  progressLabel ← "{terminés} / {total} complétées"
  progressBar.largeur ← pct%

  SI pct == 100 ET total > 0 ALORS
    progressBar.couleur ← dégradé vert  // toutes faites !
  SINON
    progressBar.couleur ← dégradé violet
```

---

### Persistance (localStorage)

```
FONCTION sauvegarder() :
  localStorage["taches-29-06-2026"] ← JSON.stringify(taches)

FONCTION charger() :
  data ← JSON.parse(localStorage["taches-29-06-2026"])
  SI data est un tableau non vide ALORS
    RETOURNER data
  SINON
    RETOURNER DEFAULT_TASKS
```

---

### Génération d'ID unique

```
FONCTION uid() :
  RETOURNER Date.now() en base36 + fragment aléatoire en base36
  // ex: "m2k8f3abc"
```

---

*Mis à jour le 29/06/2026*
