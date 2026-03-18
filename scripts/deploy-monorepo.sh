#!/bin/bash

# Script de déploiement optimisé pour mono-repo

set -e

echo "🚀 Déploiement IMMO Mono-Repo..."

# Détecter ce qui a été modifié
if [ -z "$1" ]; then
    echo "Usage: $0 [backend|frontend|infra|all]"
    exit 1
fi

DEPLOY_TARGET=$1

case $DEPLOY_TARGET in
    "backend")
        echo "🐳 Déploiement du backend uniquement..."
        
        # Build et push du backend
        docker build -f backend/Dockerfile.prod -t immo-backend:latest ./backend
        
        # Push vers ECR
        aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
        docker tag immo-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/immo-backend:latest
        docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/immo-backend:latest
        
        # Mettre à jour ECS
        aws ecs update-service \
            --cluster immo-cluster \
            --service immo-backend-service \
            --task-definition immo-backend \
            --force-new-deployment \
            --region us-east-1
        ;;
        
    "frontend")
        echo "⚛️  Déploiement du frontend..."
        cd frontend
        npm ci
        npm run build
        
        # Optionnel: Déployer vers S3/CloudFront
        # aws s3 sync build/ s3://votre-bucket/
        ;;
        
    "infra")
        echo "🏗️  Déploiement de l'infrastructure..."
        cd terraform
        terraform init
        terraform plan -var="db_password=$DB_PASSWORD" -out=tfplan
        terraform apply -auto-approve tfplan
        ;;
        
    "all")
        echo "🔄 Déploiement complet..."
        ./scripts/deploy-infrastructure.sh
        ./scripts/deploy-application.sh
        ;;
        
    *)
        echo "❌ Cible invalide: $DEPLOY_TARGET"
        echo "Options: backend, frontend, infra, all"
        exit 1
        ;;
esac

echo "✅ Déploiement terminé!"
