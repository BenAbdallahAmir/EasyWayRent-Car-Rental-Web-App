<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cars_count' => $this->whenCounted('cars'), // Inclut le compte si chargé
            'cars' => $this->whenLoaded('cars', fn() => $this->cars), // Inclut les voitures si chargées
            'created_at' => $this->created_at,
        ];
    }
}
