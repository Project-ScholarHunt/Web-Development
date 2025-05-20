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
        Schema::create('applicants', function (Blueprint $table) {
            $table->id('applicant_id');
            $table->string('fullname');
            $table->string('nim');
            $table->string('address');
            $table->string('university');
            $table->string('major');
            $table->float('ipk');
            $table->date('registration_date');
            $table->string('recommendation_letter');
            $table->string('statement_letter');
            $table->string('grade_transcript');
            $table->string('city');
            $table->string('province');
            $table->string('postal_code');

            $table->unsignedBigInteger('scholarship_id');
            $table->foreign('scholarship_id')->references('scholarship_id')->on('scholarships')->onDelete('cascade');

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
