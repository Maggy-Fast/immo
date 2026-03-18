#!/bin/bash

# Déploiement frontend sur S3 + CloudFront

set -e

echo "⚛️  Déploiement du frontend React sur S3..."

# Variables
S3_BUCKET=${S3_BUCKET:-"immo-frontend-static"}
CLOUDFRONT_DISTRIBUTION=${CLOUDFRONT_DISTRIBUTION:-"EXXXXXXXXXXXXX"}
AWS_REGION=${AWS_REGION:-"us-east-1"}

# Build du frontend
echo "🔨 Build du frontend..."
cd frontend
npm ci
npm run build

# Déploiement vers S3
echo "📤 Upload vers S3..."
aws s3 sync build/ s3://$S3_BUCKET/ --delete --region $AWS_REGION

# Invalidation CloudFront
echo "🔄 Invalidation CloudFront..."
if [ "$CLOUDFRONT_DISTRIBUTION" != "EXXXXXXXXXXXXX" ]; then
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION \
        --paths "/*" \
        --region $AWS_REGION
fi

echo "✅ Frontend déployé!"
echo "🌐 URL: https://votre-domaine.com"

# Configuration CORS pour S3
echo "🔧 Configuration CORS S3..."
aws s3api put-bucket-cors \
    --bucket $S3_BUCKET \
    --cors-configuration '{
        "CORSRules": [
            {
                "AllowedOrigins": ["*"],
                "AllowedHeaders": ["*"],
                "AllowedMethods": ["GET", "HEAD"],
                "MaxAgeSeconds": 3000
            }
        ]
    }' \
    --region $AWS_REGION
