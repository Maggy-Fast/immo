# Guide de déploiement AWS pour IMMO Backend

## Prérequis
- Compte AWS avec permissions ECS, ECR, RDS, ElastiCache
- Docker installé localement
- AWS CLI configuré (`aws configure`)
- Domaine configuré pour pointer vers AWS

## Architecture AWS recommandée

### Services
- **ECS Fargate**: Conteneurs PHP-FPM et Nginx
- **ECR**: Registry Docker pour les images
- **RDS**: Base de données PostgreSQL
- **ElastiCache**: Redis pour cache et queues
- **Application Load Balancer**: Load balancing et SSL
- **Secrets Manager**: Gestion des secrets
- **CloudWatch**: Logs et monitoring

## Étapes de déploiement

### 1. Configuration de l'infrastructure

#### Créer le cluster ECS
```bash
aws ecs create-cluster --cluster-name immo-cluster --region us-east-1
```

#### Créer le repository ECR
```bash
aws ecr create-repository --repository-name immo-backend --region us-east-1
```

#### Créer les rôles IAM
```bash
# Rôle d'exécution des tâches
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://aws/ecs-task-execution-role.json

# Rôle des tâches
aws iam create-role --role-name ecsTaskRole --assume-role-policy-document file://aws/ecs-task-role.json
```

### 2. Configuration de la base de données

#### Créer RDS PostgreSQL
```bash
aws rds create-db-instance \
    --db-instance-identifier immo-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username immo_user \
    --master-user-password VotreMotDePasseSecurise \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name default \
    --backup-retention-period 7 \
    --multi-az \
    --storage-type gp2 \
    --region us-east-1
```

#### Créer ElastiCache Redis
```bash
aws elasticache create-cache-cluster \
    --cache-cluster-id immo-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --security-group-ids sg-xxxxxxxxx \
    --region us-east-1
```

### 3. Stockage des secrets

#### Créer les secrets dans AWS Secrets Manager
```bash
# Mot de passe base de données
aws secretsmanager create-secret \
    --name immo/db-password \
    --secret-string "VotreMotDePasseSecurise"

# Clé AWS
aws secretsmanager create-secret \
    --name immo/aws-secret-key \
    --secret-string "VOTRE_SECRET_ACCESS_KEY"

# Token Twilio
aws secretsmanager create-secret \
    --name immo/twilio-token \
    --secret-string "VOTRE_TWILIO_AUTH_TOKEN"
```

### 4. Déploiement de l'application

#### Build et push de l'image Docker
```bash
# Rendre le script exécutable
chmod +x deploy-aws.sh

# Exécuter le déploiement
./deploy-aws.sh
```

#### Créer le service ECS
```bash
aws ecs create-service \
    --cluster immo-cluster \
    --service-name immo-backend-service \
    --task-definition immo-backend:latest \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxxx,subnet-yyyyyyyy],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/immo-backend/xxxxxxxx,containerName=immo-backend-app,containerPort=9000 \
    --region us-east-1
```

### 5. Configuration du Load Balancer

#### Créer Application Load Balancer
```bash
aws elbv2 create-load-balancer \
    --name immo-alb \
    --subnets subnet-xxxxxxxxx subnet-yyyyyyyy \
    --security-groups sg-xxxxxxxxx \
    --scheme internet-facing \
    --type application \
    --region us-east-1
```

#### Configurer SSL/TLS
```bash
aws acm request-certificate \
    --domain-name votre-domaine-aws.com \
    --validation-method DNS \
    --region us-east-1
```

### 6. Monitoring et logging

#### Configurer CloudWatch
```bash
# Créer un groupe de logs
aws logs create-log-group --log-group-name /ecs/immo-backend --region us-east-1

# Créer des alarmes
aws cloudwatch put-metric-alarm \
    --alarm-name immo-backend-high-cpu \
    --alarm-description "CPU usage too high" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

## Variables d'environnement

Copier `.env.aws.example` vers `.env.aws` et configurer:

```bash
cp .env.aws.example .env.aws
```

Variables importantes à configurer:
- `APP_URL`: URL de votre application AWS
- `DB_HOST`: Endpoint RDS PostgreSQL
- `REDIS_HOST`: Endpoint ElastiCache Redis
- `AWS_*`: Clés et configuration AWS
- `TWILIO_*`: Configuration Twilio WhatsApp

## Sécurité

### Configuration réseau
- Utiliser des VPC privés
- Configurer les security groups
- Activer HTTPS avec certificat SSL/TLS

### Gestion des secrets
- Utiliser AWS Secrets Manager
- Ne jamais stocker de secrets dans le code
- Rotation automatique des secrets

### Monitoring
- Activer CloudWatch Logs
- Configurer des alarmes
- Surveiller les métriques ECS

## Déploiement continu

### CI/CD avec AWS CodePipeline
```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Login to Amazon ECR
        run: aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
      - name: Build and push Docker image
        run: |
          docker build -t immo-backend ./backend
          docker tag immo-backend:latest ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/immo-backend:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/immo-backend:latest
      - name: Update ECS service
        run: aws ecs update-service --cluster immo-cluster --service immo-backend-service --force-new-deployment
```

## Coûts estimés (mensuels)

- ECS Fargate: ~$20-50
- RDS PostgreSQL: ~$15-30
- ElastiCache Redis: ~$10-25
- Load Balancer: ~$25
- Data Transfer: ~$10-20
- **Total estimé**: ~$80-150/mois

## Support et monitoring

### Commandes utiles
```bash
# Vérifier le statut du service
aws ecs describe-services --cluster immo-cluster --services immo-backend-service

# Voir les logs
aws logs tail /ecs/immo-backend --follow

# Redémarrer le service
aws ecs update-service --cluster immo-cluster --service immo-backend-service --force-new-deployment
```

### Dépannage
- Vérifier les security groups
- Consulter les logs CloudWatch
- Valider la configuration réseau
- Vérifier les variables d'environnement
