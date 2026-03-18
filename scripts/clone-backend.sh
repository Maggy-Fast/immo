#!/bin/bash

# Script pour cloner uniquement le backend depuis le mono-repo

echo "📦 Clone du backend IMMO depuis le mono-repo..."

# Variables
REPO_URL="https://github.com/votre-username/imo.git"
TARGET_DIR="immo-backend"

# Option 1: Clone partiel avec sparse-checkout (recommandé)
echo "🔧 Clone partiel avec sparse-checkout..."
mkdir -p $TARGET_DIR
cd $TARGET_DIR

git init
git remote add origin $REPO_URL
git config core.sparsecheckout true
echo "backend/*" > .git/info/sparse-checkout
echo "docker/*" >> .git/info/sparse-checkout
echo "aws/*" >> .git/info/sparse-checkout
echo "terraform/*" >> .git/info/sparse-checkout
echo "scripts/*" >> .git/info/sparse-checkout

git pull origin main

echo "✅ Backend cloné dans: $TARGET_DIR"

# Option 2: Clone complet puis suppression (alternative)
# git clone $REPO_URL $TARGET_DIR
# cd $TARGET_DIR
# rm -rf frontend/
# rm -rf docs/
# rm -rf README.md
