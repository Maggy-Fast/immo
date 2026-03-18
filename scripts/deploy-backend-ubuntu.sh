#!/bin/bash

# Script de déploiement backend optimisé pour Ubuntu

set -e

echo "🚀 Déploiement Backend IMMO sur Ubuntu..."

# Vérifier si on est dans le bon dossier
if [ ! -d "backend" ]; then
    echo "❌ Erreur: Dossier 'backend' non trouvé. Exécutez depuis la racine du projet."
    exit 1
fi

# Variables
AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}

echo "📦 Build de l'image Docker backend..."
cd backend

# Build optimisé pour Ubuntu
docker build -f Dockerfile.prod -t immo-backend:latest .

# Tagger pour ECR
docker tag immo-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/immo-backend:latest

echo "🔐 Connexion à ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "📤 Push vers ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/immo-backend:latest

cd ..

echo "🔄 Mise à jour ECS..."
# Mettre à jour la définition de tâche
aws ecs register-task-definition \
    --cli-input-json file://aws/ecs-task-definition.json \
    --region $AWS_REGION

# Mettre à jour le service
aws ecs update-service \
    --cluster immo-cluster \
    --service immo-backend-service \
    --task-definition immo-backend \
    --force-new-deployment \
    --region $AWS_REGION

echo "⏳ Attente du déploiement..."
aws ecs wait services-stable \
    --cluster immo-cluster \
    --services immo-backend-service \
    --region $AWS_REGION

echo "✅ Backend déployé avec succès!"

# Afficher l'URL du Load Balancer
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names immo-alb \
    --region $AWS_REGION \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

echo "🌐 URL de l'API: http://$ALB_DNS"
echo "🔗 Endpoint API: http://$ALB_DNS/api"
