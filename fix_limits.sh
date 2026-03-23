# Config PHP
cat << 'EOF' > /tmp/custom-php.ini
upload_max_filesize = 50M
post_max_size = 50M
memory_limit = 256M
EOF

# Config Nginx
# On recrée une config propre car l'actuelle semblait bizarre/mélangée
cat << 'EOF' > /tmp/nginx-default.conf
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass immo-backend-app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# Application des configs
sudo docker cp /tmp/custom-php.ini immo-backend-app:/usr/local/etc/php/conf.d/custom-php.ini
sudo docker cp /tmp/nginx-default.conf immo-backend-nginx:/etc/nginx/conf.d/default.conf

# Redémarrage des services
sudo docker restart immo-backend-app immo-backend-nginx
