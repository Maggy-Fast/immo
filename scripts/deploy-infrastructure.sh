#!/bin/bash

# Déploiement de l'infrastructure AWS avec Terraform

set -e

echo "🏗️  Déploiement de l'infrastructure AWS..."

# Variables
AWS_REGION=${AWS_REGION:-"us-east-1"}
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Initialiser Terraform
echo "📦 Initialisation de Terraform..."
cd terraform
terraform init

# Planifier le déploiement
echo "📋 Planification du déploiement..."
terraform plan -var="db_password=$DB_PASSWORD" -out=tfplan

# Appliquer le déploiement
echo "🚀 Application du déploiement..."
terraform apply -auto-approve tfplan

# Récupérer les outputs
echo "📤 Récupération des outputs..."
VPC_ID=$(terraform output -raw vpc_id)
ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
ECR_URL=$(terraform output -raw ecr_repository_url)
ALB_DNS=$(terraform output -raw load_balancer_dns)
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
REDIS_ENDPOINT=$(terraform output -raw redis_endpoint)
SG_ID=$(terraform output -raw security_group_id)

# Sauvegarder les outputs dans un fichier .env
cat > ../.env.infra <<EOF
# Infrastructure AWS
VPC_ID=$VPC_ID
ECS_CLUSTER=$ECS_CLUSTER
ECR_REPOSITORY_URL=$ECR_URL
LOAD_BALANCER_DNS=$ALB_DNS
RDS_ENDPOINT=$RDS_ENDPOINT
REDIS_ENDPOINT=$REDIS_ENDPOINT
SECURITY_GROUP_ID=$SG_ID
AWS_REGION=$AWS_REGION
EOF

echo "✅ Infrastructure déployée avec succès!"
echo "🌐 Load Balancer: http://$ALB_DNS"
echo "📊 RDS Endpoint: $RDS_ENDPOINT"
echo "🔴 Redis Endpoint: $REDIS_ENDPOINT"

cd ..
