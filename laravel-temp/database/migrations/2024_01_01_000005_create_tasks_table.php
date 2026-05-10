<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('statut', ['A_FAIRE', 'EN_COURS', 'TERMINE'])->default('A_FAIRE');
            $table->enum('priorite', ['BASSE', 'MOYENNE', 'HAUTE'])->default('MOYENNE');
            $table->foreignId('assigne_a_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date_echeance')->nullable();
            $table->timestamps();

            $table->index('statut');
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
