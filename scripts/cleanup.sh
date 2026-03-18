#!/bin/bash

# Nettoyage des ressources AWS

set -e

echo "🧹 Nettoyage des ressources AWS..."

# Variables
AWS_REGION=${AWS_REGION:-"us-east-1"}

# Supprimer le service ECS
echo "🗑️  Suppression du service ECS..."
aws ecs update-service \
    --cluster immo-cluster \
    --service immo-backend-service \
    --desired-count 0 \
    --region $AWS_REGION

aws ecs delete-service \
    --cluster immo-cluster \
    --service immo-backend-service \
    --region $AWS_REGION

# Supprimer les définitions de tâche
echo "🗑️  Suppression des définitions de tâche..."
TASK_DEFINITIONS=$(aws ecs list-task-definitions --region $AWS_REGION --query 'taskDefinitionArns' --output text)
for TASK_DEF in $TASK_DEFINITIONS; do
    aws ecs deregister-task-definition --task-definition $TASK_DEF --region $AWS_REGION
done

# Supprimer le cluster ECS
echo "🗑️  Suppression du cluster ECS..."
aws ecs delete-cluster --cluster immo-cluster --region $AWS_REGION

# Supprimer l'instance RDS
echo "🗑️  Suppression de l'instance RDS..."
aws rds delete-db-instance \
    --db-instance-identifier immo-db \
    --skip-final-snapshot \
    --delete-automated-backups \
    --region $AWS_REGION

# Supprimer le cluster ElastiCache
echo "🗑️  Suppression du cluster ElastiCache..."
aws elasticache delete-cache-cluster \
    --cache-cluster-id immo-redis \
    --region $AWS_REGION

# Supprimer le Load Balancer
echo "🗑️  Suppression du Load Balancer..."
ALB_ARN=$(aws elbv2 describe-load-balancers --names immo-alb --region $AWS_REGION --query 'LoadBalancers[0].LoadBalancerArn' --output text)
aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN --region $AWS_REGION

# Supprimer le target group
echo "🗑️  Suppression du target group..."
TG_ARN=$(aws elbv2 describe-target-groups --names immo-tg --region $AWS_REGION --query 'TargetGroups[0].TargetGroupArn' --output text)
aws elbv2 delete-target-group --target-group-arn $TG_ARN --region $AWS_REGION

# Supprimer le repository ECR
echo "🗑️  Suppression du repository ECR..."
aws ecr delete-repository --repository-name immo-backend --force --region $AWS_REGION

# Nettoyer avec Terraform
echo "🗑️  Nettoyage Terraform..."
cd terraform
terraform destroy -auto-approve -var="db_password=$DB_PASSWORD"
cd ..

echo "✅ Nettoyage terminé!"
