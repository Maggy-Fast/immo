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
        Schema::create('promoteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->text('adresse')->nullable();
            $table->string('cin')->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('id_utilisateur')->nullable()->constrained('users')->onDelete('set null');
            $table->string('licence')->nullable(); // Numéro de licence promoteur
            $table->string('registre_commerce')->nullable(); // Document registre de commerce
            $table->string('statut_juridique')->nullable(); // SARL, SA, EURL, etc.
            $table->timestamps();
            
            // Index pour optimisation
            $table->index('id_tenant');
            $table->index('nom');
            $table->index('telephone');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promoteurs');
    }
};
