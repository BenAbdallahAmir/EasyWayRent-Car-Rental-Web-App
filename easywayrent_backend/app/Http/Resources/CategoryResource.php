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
            'cars_count' => $this->whenCounted('cars'), // Includes the count if loaded
            'cars' => $this->whenLoaded('cars', fn() => $this->cars), // Includes the cars if loaded
            'created_at' => $this->created_at,
        ];
    }
}

