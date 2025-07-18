<?php

use Illuminate\Support\Facades\Route;
use App\Models\Entry;
use Inertia\Inertia;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\LeadController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'entries' => Entry::all()
    ]);
})->name('home');

Route::post('/upload', [UploadController::class, 'create'])->name('upload');
Route::get('/entry/{id}', function ($id) {
    return Inertia::render('entry', [
        'entry' => Entry::find($id)
    ]);
})->name('entry');

Route::post('/lead', [LeadController::class, 'store'])->name('lead');

Route::get('/events', function () {
    set_time_limit(0);

    return response()->eventStream(function () {
        $lastCheck = now();
        
        while (true) {
            // Only get entries that have been updated since the last check
            $entries = Entry::where('status', 'READY')
                ->where('updated_at', '>', $lastCheck)
                ->get();
            
            if ($entries->isNotEmpty()) {
                foreach ($entries as $entry) {
                    yield $entry->toJson();
                }
            }
            
            $lastCheck = now();
            sleep(1);
        }
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
