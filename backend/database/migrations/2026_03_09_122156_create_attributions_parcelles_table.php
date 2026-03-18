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
        Schema::create('attributions_parcelles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('id_adherent')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('id_parcelle')->constrained('parcelles_cooperative')->onDelete('cascade');
            $table->decimal('pourcentage_possession', 5, 2)->default(100);
            $table->date('date_attribution');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attributions_parcelles');
    }
};
