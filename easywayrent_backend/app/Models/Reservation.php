<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Car;
use App\Models\Cart;


class Reservation extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'car_id', 'start_date', 'end_date', 'pickup_location', 'dropoff_location', 'total_price', 'payment_method', 'status'];

    protected $casts = [
        'start_date' => 'datetime:Y-m-d',
        'end_date' => 'datetime:Y-m-d',
        'total_price' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
}
