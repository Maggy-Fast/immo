<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupes_cooperative', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_tenant')->constrained('tenants')->onDelete('cascade');
            $table->string('nom');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['id_tenant', 'nom']);
        });

        Schema::table('adherents', function (Blueprint $table) {
            $table->foreignId('id_groupe')->nullable()->after('id_tenant')->constrained('groupes_cooperative')->nullOnDelete();
            $table->index(['id_tenant', 'id_groupe']);
        });

        Schema::table('parcelles_cooperative', function (Blueprint $table) {
            $table->foreignId('id_groupe')->nullable()->after('id_tenant')->constrained('groupes_cooperative')->nullOnDelete();
            $table->decimal('latitude', 10, 7)->nullable()->after('description');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->index(['id_tenant', 'id_groupe']);
        });

        Schema::table('parametres_cotisation', function (Blueprint $table) {
            $table->foreignId('id_groupe')->nullable()->after('id_tenant')->constrained('groupes_cooperative')->nullOnDelete();
            $table->index(['id_tenant', 'id_groupe', 'actif']);
        });

        Schema::table('echeances', function (Blueprint $table) {
            $table->foreignId('id_groupe')->nullable()->after('id_tenant')->constrained('groupes_cooperative')->nullOnDelete();
            $table->index(['id_tenant', 'id_groupe']);
        });

        $tenants = DB::table('tenants')->select('id')->get();
        foreach ($tenants as $tenant) {
            $idGroupe = DB::table('groupes_cooperative')->insertGetId([
                'id_tenant' => $tenant->id,
                'nom' => 'Groupe par défaut',
                'description' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('adherents')
                ->where('id_tenant', $tenant->id)
                ->whereNull('id_groupe')
                ->update(['id_groupe' => $idGroupe]);

            DB::table('parcelles_cooperative')
                ->where('id_tenant', $tenant->id)
                ->whereNull('id_groupe')
                ->update(['id_groupe' => $idGroupe]);

            DB::table('parametres_cotisation')
                ->where('id_tenant', $tenant->id)
                ->whereNull('id_groupe')
                ->update(['id_groupe' => $idGroupe]);

            DB::table('echeances')
                ->where('id_tenant', $tenant->id)
                ->whereNull('id_groupe')
                ->update(['id_groupe' => $idGroupe]);
        }
    }

    public function down(): void
    {
        Schema::table('echeances', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_groupe');
        });

        Schema::table('parametres_cotisation', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_groupe');
        });

        Schema::table('parcelles_cooperative', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
            $table->dropConstrainedForeignId('id_groupe');
        });

        Schema::table('adherents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_groupe');
        });

        Schema::dropIfExists('groupes_cooperative');
    }
};
