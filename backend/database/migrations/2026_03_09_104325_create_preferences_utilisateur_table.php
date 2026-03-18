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
        Schema::create('preferences_utilisateur', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_utilisateur')->unique()->constrained('utilisateurs')->onDelete('cascade');
            $table->string('theme')->default('clair');
            $table->string('langue')->default('fr');
            $table->boolean('notifications_email')->default(true);
            $table->boolean('notifications_whatsapp')->default(false);
            $table->string('format_date')->default('DD/MM/YYYY');
            $table->string('devise')->default('FCFA');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preferences_utilisateur');
    }
};
