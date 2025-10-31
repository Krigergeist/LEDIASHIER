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
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('usr_id');
            $table->string('usr_name');
            $table->string('usr_email')->unique();
            $table->timestamp('usr_email_verified_at')->nullable();
            $table->string('usr_password');
            $table->string('usr_remembered_token')->nullable();
            $table->timestamp('usr_created_at')->useCurrent();
            $table->timestamp('usr_updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
