sudo docker exec immo-backend-app php artisan tinker --execute="echo 'BIEN_DATA: ' . json_encode(DB::table('biens')->where('adresse', 'LIKE', '%Almadies%')->first());"
