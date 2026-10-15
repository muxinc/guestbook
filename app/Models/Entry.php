<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    protected $fillable = [
        'playback_id',
        'event_id',
        'status',
        'aspect_ratio',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'event_id' => 'integer',
    ];

    protected $attributes = [
        'status' => null,
        'aspect_ratio' => null,
    ];

    public function scopeCurrentEvent(Builder $query): void
    {
        $query->where('event_id', config('app.event_id'));
    }
}
