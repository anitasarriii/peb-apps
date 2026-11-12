<?php

// database/factories/HeroSectionServisFactory.php

namespace Database\Factories;

use App\Models\HeroSectionServis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroSectionServis>
 */
class HeroSectionServisFactory extends Factory
{
    protected $model = HeroSectionServis::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'title' => $this->faker->words(3, true),
            'subtitle' => $this->faker->sentence(12),
            'carousel_items' => [
                [
                    'id' => 'slide-1',
                    'type' => 'image',
                    'sourceType' => 'url',
                    'url' => '/assets/tentang-kami/hero/hero.png',
                ],
            ],
        ];
    }
}
