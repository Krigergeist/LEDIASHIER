<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


Route::get('/support', function () {
    return Inertia::render('Support');
})->name('support');

Route::post('/support/send', [SupportController::class, 'send'])->name('support.send');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::middleware(['auth'])->group(function () {
    Route::resource('products', ProductController::class)->except(['show']);
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/create', [TransactionController::class, 'create'])->name('transactions.create'); // ✅ tambahkan
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transactions/{tsn}/edit', [TransactionController::class, 'edit'])->name('transactions.edit'); // ✅ tambahkan
    Route::post('/transactions/{tsnId}/confirm-debt', [TransactionController::class, 'confirmDebt']);
    Route::delete('/transactions/{tsn}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/debts', [DebtController::class, 'index'])->name('debts.index');
    Route::get('/debts/{deb_id}', [DebtController::class, 'show'])->name('debts.show');
    Route::get('/debts/{deb_id}/edit', [DebtController::class, 'edit'])->name('debts.edit');
    Route::put('/debts/{deb_id}', [DebtController::class, 'update'])->name('debts.update');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'exportPdf'])->name('reports.export');
});
