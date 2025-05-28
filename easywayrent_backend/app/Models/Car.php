<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Cart;
use App\Models\Rental;
use App\Models\Category;

class Car extends Model
{
    protected $fillable = [
        'category_id',
        'model',
        'brand',
        'doors',
        'luggage',
        'passengers',
        'year',
        'status',
        'price_per_day',
        'image',
        'license_plate',
        'description',
    ];



    protected $casts = [
        'doors' => 'integer',
        'luggage' => 'integer',
        'passengers' => 'integer',
        'year' => 'integer',
        'price_per_day' => 'float',
        'status' => 'string',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
