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
        Schema::create('activity', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->nullable();
            $table->text('payload')->nullable();
            $table->bigInteger('entry_id')->nullable();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('entry_id')->nullable();
            $table->string('asset_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->string('delete_key')->nullable();
        });

        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->nullable();
            $table->string('playback_id')->nullable();
            $table->bigInteger('event_id')->nullable();
            $table->string('status')->nullable();
            $table->string('aspect_ratio')->nullable();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->nullable();
            $table->string('name')->nullable();
        });

        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_id')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('entries'); 
        Schema::dropIfExists('events');
        Schema::dropIfExists('leads');
    }
};
