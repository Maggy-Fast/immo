<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table des ADHERENTS
        Schema::create('adherents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('numero')->unique(); // ADH001, ADH002...
            $table->string('nom');
            $table->string('prenom');
            $table->string('cin')->nullable();
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->text('adresse')->nullable();
            $table->date('date_adhesion');
            $table->enum('statut', ['actif', 'suspendu', 'radie'])->default('actif');
            $table->integer('echeances_en_retard')->default(0);
            $table->timestamps();
        });

        // Table des PARAMETRES COTISATION
        Schema::create('parametres_cotisation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->decimal('montant', 15, 2);
            $table->enum('frequence', ['mensuel', 'trimestriel', 'annuel'])->default('mensuel');
            $table->integer('jour_echeance')->default(1); // Jour du mois
            $table->date('date_debut');
            $table->integer('periode_grace_jours')->default(5);
            $table->integer('max_echeances_retard')->default(3); // Suspension après X retards
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Table des ECHEANCES
        Schema::create('echeances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_adherent')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('id_parametre')->constrained('parametres_cotisation')->onDelete('cascade');
            $table->date('date_echeance');
            $table->decimal('montant', 15, 2);
            $table->enum('statut', ['a_payer', 'paye', 'en_retard'])->default('a_payer');
            $table->date('date_paiement')->nullable();
            $table->decimal('montant_paye', 15, 2)->nullable();
            $table->decimal('penalite', 15, 2)->default(0);
            $table->string('mode_paiement')->nullable(); // especes, virement, mobile_money
            $table->text('reference_paiement')->nullable();
            $table->timestamps();
        });

        // Table des PARCELLES COOPERATIVE
        Schema::create('parcelles_cooperative', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('numero')->unique();
            $table->decimal('surface', 10, 2);
            $table->decimal('prix', 15, 2);
            $table->enum('statut', ['disponible', 'attribuee', 'vendue'])->default('disponible');
            $table->foreignId('id_adherent')->nullable()->constrained('adherents')->onDelete('set null');
            $table->date('date_attribution')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Table HISTORIQUE ATTRIBUTION PARCELLES
        Schema::create('historique_attributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_parcelle')->constrained('parcelles_cooperative')->onDelete('cascade');
            $table->foreignId('id_adherent')->constrained('adherents')->onDelete('cascade');
            $table->date('date_attribution');
            $table->date('date_retrait')->nullable();
            $table->text('motif')->nullable();
            $table->timestamps();
        });

        // Table NOTIFICATIONS WHATSAPP
        Schema::create('notifications_whatsapp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_adherent')->constrained('adherents')->onDelete('cascade');
            $table->enum('type', ['rappel', 'retard', 'suspension', 'confirmation_paiement']);
            $table->text('message');
            $table->string('telephone');
            $table->enum('statut', ['en_attente', 'envoye', 'echec'])->default('en_attente');
            $table->timestamp('date_envoi')->nullable();
            $table->text('erreur')->nullable();
            $table->timestamps();
        });

        // Table MODELES MESSAGES
        Schema::create('modeles_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->enum('type', ['rappel', 'retard', 'suspension', 'confirmation_paiement'])->unique();
            $table->text('contenu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modeles_messages');
        Schema::dropIfExists('notifications_whatsapp');
        Schema::dropIfExists('historique_attributions');
        Schema::dropIfExists('parcelles_cooperative');
        Schema::dropIfExists('echeances');
        Schema::dropIfExists('parametres_cotisation');
        Schema::dropIfExists('adherents');
    }
};
