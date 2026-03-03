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
        // Table des CONTRATS DE BAIL
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_bien')->constrained('biens')->onDelete('cascade');
            $table->foreignId('id_locataire')->constrained('locataires')->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('loyer_mensuel', 15, 2);
            $table->decimal('caution', 15, 2)->default(0);
            $table->string('statut')->default('actif'); // actif, termine, resilie
            $table->timestamps();
        });

        // Table des LOYERS (Paiements mensuels)
        Schema::create('loyers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_contrat')->constrained('contrats')->onDelete('cascade');
            $table->string('mois'); // ex: "2024-02"
            $table->decimal('montant', 15, 2);
            $table->string('statut')->default('impaye'); // paye, impaye, partiel
            $table->string('mode_paiement')->nullable(); // especes, virement, wave, om
            $table->timestamp('date_paiement')->nullable();
            $table->timestamps();
        });

        // Table des QUITTANCES (Documents générés)
        Schema::create('quittances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_loyer')->constrained('loyers')->onDelete('cascade');
            $table->string('numero_quittance')->unique();
            $table->string('chemin_pdf')->nullable();
            $table->timestamp('generee_le')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quittances');
        Schema::dropIfExists('loyers');
        Schema::dropIfExists('contrats');
    }
};
