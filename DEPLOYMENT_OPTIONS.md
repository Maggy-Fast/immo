# Déploiement séparé: Backend ECS + Frontend S3

## Architecture
- Backend: ECS Fargate (API Laravel)
- Frontend: S3 + CloudFront (React statique)
- Base de données: RDS PostgreSQL
- Cache: ElastiCache Redis

## Avantages
- ✅ Coûts optimisés (S3 très économique)
- ✅ Scalabilité indépendante
- ✅ Déploiement frontend instantané
- ✅ CDN mondial avec CloudFront

## Configuration
# Backend (déjà configuré)
./scripts/deploy-monorepo.sh backend

# Frontend (nouveau script)
./scripts/deploy-frontend.sh
