#!/bin/bash

# Monitoring de l'application AWS

set -e

echo "📊 Monitoring de l'application IMMO..."

# Charger les variables d'infrastructure
source .env.infra

# Variables
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECS_CLUSTER=${ECS_CLUSTER:-"immo-cluster"}

echo "📈 Statut du cluster ECS..."
aws ecs describe-clusters \
    --clusters $ECS_CLUSTER \
    --region $AWS_REGION \
    --query 'clusters[0].{Name:name,Status:status,RunningTasks:runningTasksCount,PendingTasks:pendingTasksCount}'

echo ""
echo "🚀 Statut du service ECS..."
aws ecs describe-services \
    --cluster $ECS_CLUSTER \
    --services immo-backend-service \
    --region $AWS_REGION \
    --query 'services[0].{ServiceName:serviceName,Status:status,DesiredCount:desiredCount,RunningCount:runningCount,PendingCount:pendingCount}'

echo ""
echo "📱 Health Check du Load Balancer..."
curl -s http://$LOAD_BALANCER_DNS/health || echo "❌ Health check failed"

echo ""
echo "📊 Métriques CloudWatch (dernières 5 minutes)..."
aws cloudwatch get-metric-statistics \
    --namespace AWS/ECS \
    --metric-name CPUUtilization \
    --dimensions Name=ServiceName,Value=immo-backend-service \
    --start-time $(date -u -v-5M +%Y-%m-%dT%H:%M:%SZ) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
    --period 60 \
    --statistics Average \
    --region $AWS_REGION \
    --query 'Datapoints[0].Average' \
    --output text

echo ""
echo "📋 Logs récents (dernières 10 lignes)..."
aws logs tail /ecs/immo-backend \
    --follow \
    --since 5m \
    --region $AWS_REGION \
    --limit 10

echo ""
echo "🔍 Vérification des erreurs..."
aws logs filter-log-events \
    --log-group-name /ecs/immo-backend \
    --filter-pattern "ERROR" \
    --start-time $(date -v-5M +%s)000 \
    --region $AWS_REGION \
    --query 'events[0:5].[timestamp,message]' \
    --output table
