# Guide de déploiement séparé pour Ubuntu

## 🎯 Objectif
Déployer uniquement le backend Laravel sur Ubuntu, continuer avec Putty/WinSCP pour le frontend

## 📦 Étapes sur Ubuntu

### 1. Clone du backend uniquement
```bash
# Méthode 1: Sparse checkout (recommandé)
mkdir immo-backend
cd immo-backend
git init
git remote add origin https://github.com/votre-username/imo.git
git config core.sparsecheckout true
echo "backend/*" > .git/info/sparse-checkout
echo "docker/*" >> .git/info/sparse-checkout
echo "aws/*" >> .git/info/sparse-checkout
echo "terraform/*" >> .git/info/sparse-checkout
echo "scripts/*" >> .git/info/sparse-checkout
git pull origin main

# Méthode 2: Clone complet puis nettoyage
git clone https://github.com/votre-username/imo.git immo-backend
cd immo-backend
rm -rf frontend/ docs/ README.md
```

### 2. Prérequis Ubuntu
```bash
# Installer Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# Installer AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Installer Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 3. Configuration AWS
```bash
# Configurer AWS CLI
aws configure
# Entrer: Access Key ID, Secret Access Key, Region us-east-1, Format json

# Tester la connexion
aws sts get-caller-identity
```

### 4. Déploiement backend
```bash
cd immo-backend

# Déployer l'infrastructure
./scripts/deploy-infrastructure.sh

# Déployer le backend
./scripts/deploy-monorepo.sh backend

# Monitorer
./scripts/monitor.sh
```

## 🌐 Pour le frontend (avec Putty/WinSCP)

### Option A: Déploiement sur votre hébergement existant
1. Via WinSCP, copiez le dossier `frontend/` sur votre serveur
2. Via Putty, build et déployez:
```bash
cd /chemin/vers/frontend
npm ci
npm run build
# Copier le build/ vers votre hébergement
```

### Option B: Déploiement sur S3 (si vous voulez tout AWS)
1. Via Putty, utilisez le script de déploiement frontend:
```bash
cd immo-backend
./scripts/deploy-frontend.sh
```

## 🔗 Configuration API
Dans votre frontend, assurez-vous que `src/config/api.js` pointe vers:
- Production: `https://votre-backend-aws.com/api`
- Développement: `http://localhost:8000/api`

## 📋 Workflow final
1. **Ubuntu**: Backend sur AWS ECS
2. **Putty/WinSCP**: Frontend sur votre hébergement habituel
3. **Communication**: Frontend appelle l'API backend AWS

## 💡 Avantages
- ✅ Backend sur AWS (scalable, sécurisé)
- ✅ Frontend sur votre infrastructure existante
- ✅ Coûts optimisés
- ✅ Workflow familier avec Putty/WinSCP
