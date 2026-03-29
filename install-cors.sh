#!/bin/bash

# Installation du package CORS Laravel
echo "🔧 Installation du package CORS..."

cd backend

# Installer le package
composer require fruitcake/laravel-cors

# Publier la configuration
php artisan vendor:publish --tag="cors"

echo "✅ Package CORS installé!"
echo "📝 Configurez maintenant config/cors.php"
