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
        // Mettre à jour la table lotissements
        Schema::table('lotissements', function (Blueprint $table) {
            $table->renameColumn('lieu', 'localisation');
            $table->integer('nombre_parcelles')->default(0)->after('superficie_totale');
            $table->decimal('latitude', 10, 8)->nullable()->after('nombre_parcelles');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
        });

        // Mettre à jour la table parcelles
        Schema::table('parcelles', function (Blueprint $table) {
            $table->renameColumn('numero_parcelle', 'numero');
        });

        // Mettre à jour la table partenariats
        Schema::table('partenariats', function (Blueprint $table) {
            $table->dropColumn(['partenaire_nom', 'pourcentage_part', 'apport_initial']);
        });

        Schema::table('partenariats', function (Blueprint $table) {
            $table->foreignId('id_promoteur')->after('id_lotissement')->constrained('proprietaires')->onDelete('cascade');
            $table->foreignId('id_proprietaire')->after('id_promoteur')->constrained('proprietaires')->onDelete('cascade');
            $table->decimal('ticket_entree', 15, 2)->default(0)->after('id_proprietaire');
            $table->decimal('pourcentage_promoteur', 5, 2)->after('ticket_entree');
            $table->decimal('pourcentage_proprietaire', 5, 2)->after('pourcentage_promoteur');
        });

        // Mettre à jour la table depenses_partenariat
        Schema::table('depenses_partenariat', function (Blueprint $table) {
            $table->dropForeign(['id_lotissement']);
            $table->dropColumn('id_lotissement');
            $table->foreignId('id_partenariat')->after('id_tenant')->constrained('partenariats')->onDelete('cascade');
            $table->renameColumn('motif', 'description');
            $table->renameColumn('date_depense', 'date');
            $table->string('piece_jointe')->nullable()->after('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lotissements', function (Blueprint $table) {
            $table->renameColumn('localisation', 'lieu');
            $table->dropColumn(['nombre_parcelles', 'latitude', 'longitude']);
        });

        Schema::table('parcelles', function (Blueprint $table) {
            $table->renameColumn('numero', 'numero_parcelle');
        });

        Schema::table('partenariats', function (Blueprint $table) {
            $table->dropForeign(['id_promoteur']);
            $table->dropForeign(['id_proprietaire']);
            $table->dropColumn(['id_promoteur', 'id_proprietaire', 'ticket_entree', 'pourcentage_promoteur', 'pourcentage_proprietaire']);
        });

        Schema::table('partenariats', function (Blueprint $table) {
            $table->string('partenaire_nom');
            $table->decimal('pourcentage_part', 5, 2);
            $table->decimal('apport_initial', 15, 2)->default(0);
        });

        Schema::table('depenses_partenariat', function (Blueprint $table) {
            $table->dropForeign(['id_partenariat']);
            $table->dropColumn(['id_partenariat', 'piece_jointe']);
            $table->foreignId('id_lotissement')->after('id_tenant')->constrained('lotissements')->onDelete('cascade');
            $table->renameColumn('description', 'motif');
            $table->renameColumn('date', 'date_depense');
        });
    }
};
