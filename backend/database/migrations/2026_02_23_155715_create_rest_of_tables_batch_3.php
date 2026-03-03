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
        // Table des LOTISSEMENTS
        Schema::create('lotissements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('nom');
            $table->string('lieu');
            $table->decimal('superficie_totale', 15, 2)->nullable();
            $table->string('statut')->default('en_cours'); // en_cours, termine, approuve
            $table->timestamps();
        });

        // Table des PARCELLES
        Schema::create('parcelles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_lotissement')->constrained('lotissements')->onDelete('cascade');
            $table->string('numero_parcelle');
            $table->decimal('superficie', 10, 2);
            $table->decimal('prix', 15, 2)->nullable();
            $table->string('statut')->default('disponible'); // disponible, vendu, reserve
            $table->timestamps();
        });

        // Table des PARTENARIATS
        Schema::create('partenariats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_lotissement')->constrained('lotissements')->onDelete('cascade');
            $table->string('partenaire_nom');
            $table->decimal('pourcentage_part', 5, 2); // ex: 30.00
            $table->decimal('apport_initial', 15, 2)->default(0);
            $table->timestamps();
        });

        // Table des DEPENSES DE PARTENARIAT
        Schema::create('depenses_partenariat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_lotissement')->constrained('lotissements')->onDelete('cascade');
            $table->string('motif');
            $table->decimal('montant', 15, 2);
            $table->date('date_depense');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('depenses_partenariat');
        Schema::dropIfExists('partenariats');
        Schema::dropIfExists('parcelles');
        Schema::dropIfExists('lotissements');
    }
};
