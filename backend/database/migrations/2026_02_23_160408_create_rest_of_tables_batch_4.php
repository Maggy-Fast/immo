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
        // Table des DOCUMENTS FONCIERS
        Schema::create('documents_fonciers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_bien')->constrained('biens')->onDelete('cascade');
            $table->string('titre');
            $table->string('type'); // titre_foncier, plan, etc.
            $table->string('chemin_fichier');
            $table->timestamps();
        });

        // Table des TRAVAUX
        Schema::create('travaux', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_bien')->constrained('biens')->onDelete('cascade');
            $table->string('intitule');
            $table->text('description')->nullable();
            $table->decimal('montant_estime', 15, 2)->nullable();
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->string('statut')->default('en_attente'); // en_attente, en_cours, termine
            $table->timestamps();
        });

        // Table des COMMISSIONS
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_contrat')->constrained('contrats')->onDelete('cascade');
            $table->decimal('montant', 15, 2);
            $table->string('statut')->default('non_paye'); // paye, non_paye
            $table->timestamps();
        });

        // Table des ABONNEMENTS (SaaS)
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('plan'); // gratuit, pro, premium
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Table des JOURNAUX D'AUDIT
        Schema::create('journaux_audit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->string('action'); // creation, modification, suppression, connexion
            $table->string('table_concernee');
            $table->bigInteger('id_enregistrement')->nullable();
            $table->text('details')->nullable();
            $table->string('adresse_ip', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journaux_audit');
        Schema::dropIfExists('abonnements');
        Schema::dropIfExists('commissions');
        Schema::dropIfExists('travaux');
        Schema::dropIfExists('documents_fonciers');
    }
};
