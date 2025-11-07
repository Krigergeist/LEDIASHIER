<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('tsn_id');
            $table->unsignedBigInteger('tsn_usr_id');
            $table->unsignedBigInteger('tsn_csm_id')->nullable();
            $table->dateTime('tsn_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('tsn_metode')->nullable();
            $table->decimal('tsn_total', 15, 2)->default(0);
            $table->decimal('tsn_paid', 15, 2)->default(0);
            $table->decimal('tsn_paid_return', 15, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('tsn_usr_id')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('tsn_csm_id')->references('csm_id')->on('customers')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
