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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('model');
            $table->string('brand');
            $table->unsignedSmallInteger('doors');
            $table->unsignedSmallInteger('luggage');
            $table->unsignedSmallInteger('passengers');
            $table->year('year');
            $table->enum('status', ['available', 'rented'])->default('available');
            $table->decimal('price_per_day', 10, 2);
            $table->string('image')->nullable();
            $table->string('license_plate')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
