#!/bin/bash

# Script de déploiement AWS pour IMMO Backend

echo "🚀 Déploiement de IMMO Backend sur AWS..."

# Variables
AWS_REGION="us-east-1"
ECR_REPOSITORY="immo-backend"
ECS_CLUSTER="immo-cluster"
ECS_SERVICE="immo-backend-service"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Étape 1: Build et push de l'image Docker
echo "📦 Construction de l'image Docker..."
docker build -t $ECR_REPOSITORY:latest ./backend

echo "🔐 Connexion à ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "📤 Push de l'image vers ECR..."
docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Étape 2: Mise à jour de la tâche ECS
echo "🔄 Mise à jour de la définition de tâche ECS..."
aws ecs register-task-definition \
    --cli-input-json file://aws/ecs-task-definition.json \
    --region $AWS_REGION

# Étape 3: Mise à jour du service ECS
echo "🔄 Mise à jour du service ECS..."
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --task-definition immo-backend:latest \
    --force-new-deployment \
    --region $AWS_REGION

echo "✅ Déploiement terminé!"
echo "🌐 Votre application est disponible sur: https://votre-domaine-aws.com"
