<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ajouter colonne photos pour les biens (JSON array)
        Schema::table('biens', function (Blueprint $table) {
            $table->json('photos')->nullable()->after('description');
        });

        // Ajouter colonne photo pour les propriétaires
        Schema::table('proprietaires', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('adresse');
        });

        // Ajouter colonne photo pour les locataires
        Schema::table('locataires', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('profession');
        });

        // Ajouter colonne plan pour les lotissements
        Schema::table('lotissements', function (Blueprint $table) {
            $table->string('plan')->nullable()->after('longitude');
        });

        // Ajouter colonne plan pour les parcelles
        Schema::table('parcelles', function (Blueprint $table) {
            $table->string('plan')->nullable()->after('statut');
        });

        // Ajouter colonne photo pour les utilisateurs
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biens', function (Blueprint $table) {
            $table->dropColumn('photos');
        });

        Schema::table('proprietaires', function (Blueprint $table) {
            $table->dropColumn('photo');
        });

        Schema::table('locataires', function (Blueprint $table) {
            $table->dropColumn('photo');
        });

        Schema::table('lotissements', function (Blueprint $table) {
            $table->dropColumn('plan');
        });

        Schema::table('parcelles', function (Blueprint $table) {
            $table->dropColumn('plan');
        });

        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn('photo');
        });
    }
};
