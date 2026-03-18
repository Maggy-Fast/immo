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
        Schema::table('parametres_cotisation', function (Blueprint $table) {
            $table->decimal('pourcentage_penalite', 5, 2)->default(0)->after('max_echeances_retard');
            $table->decimal('montant_penalite_fixe', 15, 2)->default(0)->after('pourcentage_penalite');
            $table->enum('mode_penalite', ['fixe', 'pourcentage', 'aucun'])->default('aucun')->after('montant_penalite_fixe');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parametres_cotisation', function (Blueprint $table) {
            $table->dropColumn(['pourcentage_penalite', 'montant_penalite_fixe', 'mode_penalite']);
        });
    }
};
