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
        // Schema::table('applicants', function (Blueprint $table) {
        //     $table->dropForeign(['student_id']);
        // });

        // Schema::table('scholarships', function (Blueprint $table) {
        //     $table->dropForeign(['admin_id']);
        // });

        // Schema::dropIfExists('students');
        // Schema::dropIfExists('admins');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
