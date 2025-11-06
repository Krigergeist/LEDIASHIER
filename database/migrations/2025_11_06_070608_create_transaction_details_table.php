<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->bigIncrements('tsnd_id');
            $table->unsignedBigInteger('tsnd_tsn_id');
            $table->unsignedBigInteger('tsnd_prd_id');
            $table->integer('tsnd_qty')->default(1);
            $table->decimal('tsnd_price', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('tsnd_tsn_id')->references('tsn_id')->on('transactions')->onDelete('cascade');
            $table->foreign('tsnd_prd_id')->references('prd_id')->on('products')->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaction_details');
    }
}
