#!/bin/bash

# Déploiement de l'application sur ECS

set -e

echo "🐳 Déploiement de l'application Docker..."

# Charger les variables d'infrastructure
source .env.infra

# Variables
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECR_REPOSITORY=${ECR_REPOSITORY_URL:-"immo-backend"}
ECS_CLUSTER=${ECS_CLUSTER:-"immo-cluster"}

# Build de l'image Docker
echo "🔨 Construction de l'image Docker..."
docker build -f backend/Dockerfile.prod -t $ECR_REPOSITORY:latest ./backend

# Connexion à ECR
echo "🔐 Connexion à ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY

# Push de l'image
echo "📤 Push de l'image vers ECR..."
docker push $ECR_REPOSITORY:latest

# Mettre à jour la définition de tâche ECS
echo "🔄 Mise à jour de la définition de tâche ECS..."
aws ecs register-task-definition \
    --cli-input-json file://aws/ecs-task-definition.json \
    --region $AWS_REGION

# Mettre à jour le service ECS
echo "🔄 Mise à jour du service ECS..."
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service immo-backend-service \
    --task-definition immo-backend:latest \
    --force-new-deployment \
    --region $AWS_REGION

echo "✅ Application déployée avec succès!"
echo "🌐 URL: http://$LOAD_BALANCER_DNS"

# Attendre que le déploiement soit terminé
echo "⏳ Attente du déploiement..."
aws ecs wait services-stable \
    --cluster $ECS_CLUSTER \
    --services immo-backend-service \
    --region $AWS_REGION

echo "🎉 Déploiement terminé!"
