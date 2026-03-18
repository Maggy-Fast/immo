# Scripts de déploiement AWS pour IMMO

## Scripts disponibles

### 1. deploy-infrastructure.sh
Déploie toute l'infrastructure AWS avec Terraform

### 2. deploy-application.sh
Déploie l'application Docker sur ECS

### 3. update-application.sh
Met à jour l'application existante

### 4. monitor.sh
Affiche les métriques et logs

### 5. cleanup.sh
Nettoie les ressources AWS

## Utilisation

```bash
# 1. Déployer l'infrastructure
./scripts/deploy-infrastructure.sh

# 2. Déployer l'application
./scripts/deploy-application.sh

# 3. Monitorer
./scripts/monitor.sh
```
