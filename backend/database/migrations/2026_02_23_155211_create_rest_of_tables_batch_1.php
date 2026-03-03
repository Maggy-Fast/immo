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
        // Table des PROPRIETAIRES
        Schema::create('proprietaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->string('adresse')->nullable();
            $table->string('cin')->nullable(); // Carte d'identité
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->timestamps();
        });

        // Table des LOCATAIRES
        Schema::create('locataires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->string('cin')->nullable();
            $table->string('profession')->nullable();
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->timestamps();
        });

        // Table des BIENS
        Schema::create('biens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_proprietaire')->constrained('proprietaires')->onDelete('cascade');
            $table->string('type'); // Appt, Maison, Terrain, etc.
            $table->string('adresse');
            $table->decimal('superficie', 10, 2)->nullable();
            $table->decimal('prix', 15, 2)->nullable();
            $table->string('statut')->default('disponible'); // disponible, loue, reserve
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biens');
        Schema::dropIfExists('locataires');
        Schema::dropIfExists('proprietaires');
    }
};
