# Variables d'environnement AWS à configurer

# 1. Cloner le repository et se positionner
git clone <votre-repo> immo
cd immo

# 2. Configurer les secrets AWS dans GitHub
# Aller dans Settings > Secrets and variables > Actions du repository GitHub
# Ajouter ces secrets :
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - DB_PASSWORD

# 3. Exporter les variables locales
export AWS_REGION="us-east-1"
export DB_PASSWORD="votre_mot_de_passe_db"

# 4. Rendre les scripts exécutables
chmod +x scripts/*.sh

# 5. Tester localement
docker-compose -f docker-compose.yml up -d

# 6. Déployer sur AWS
./scripts/deploy-infrastructure.sh
./scripts/deploy-application.sh
