<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDebtsTable extends Migration
{
    public function up()
    {
        Schema::create('debts', function (Blueprint $table) {
            $table->bigIncrements('deb_id');
            $table->unsignedBigInteger('deb_tsn_id');
            $table->unsignedBigInteger('deb_csm_id');
            $table->decimal('deb_amount', 15, 2)->default(0);
            $table->decimal('deb_paid_amount', 15, 2)->default(0);
            $table->date('deb_due_date')->nullable();
            $table->enum('deb_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->timestamps();

            $table->foreign('deb_tsn_id')->references('tsn_id')->on('transactions')->onDelete('cascade');
            $table->foreign('deb_csm_id')->references('csm_id')->on('customers')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('debts');
    }
}
