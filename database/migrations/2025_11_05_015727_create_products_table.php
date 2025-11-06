<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('prd_id');
            $table->string('prd_code')->unique();
            $table->string('prd_name');
            $table->decimal('prd_price', 12, 2)->nullable();
            $table->integer('prd_stock')->nullable();
            $table->text('prd_description')->nullable();
            $table->string('prd_img')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('products');
    }
};
