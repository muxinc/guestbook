<?php

use Illuminate\Support\Facades\Route;
use App\Models\Entry;
use Inertia\Inertia;
use App\Http\Controllers\UploadController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'entries' => Entry::all()
    ]);
})->name('home');

Route::post('/upload', [UploadController::class, 'create'])->name('upload');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
