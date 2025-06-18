<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'event_id',
        'first_name', 
        'last_name',
        'email'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'event_id' => 'integer'
    ];
}
