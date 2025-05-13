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
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id('scholarship_id');
            $table->string('scholarship_name');
            $table->string('partner');
            $table->string('description');
            $table->string('terms_and_conditions');
            $table->integer('quota');
            $table->date('time_limit');
            $table->string('logo');
            $table->string('thumbnail')->nullable(); // Tambahkan ini
            
            // Buat kolom opsional
            $table->unsignedBigInteger('admin_id')->nullable();
            
            
            // Hapus foreign key constraint untuk sementara
            // $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarships');
    }
};
