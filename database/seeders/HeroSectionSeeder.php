<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if ($user) {
            HeroSection::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'title' => 'Energi Untuk Negeri',
                    'subtitle' => 'Mengalirkan keandalan, menghidupkan harapan. Wujud nyata komitmen kami untuk kemajuan Batam dan Indonesia.',
                    'cta_label' => 'Jelajahi Inovasi Kami',
                    'cta_href' => '#inovasi',
                    'secondary_cta_label' => 'Kontak Kami',
                    'secondary_cta_href' => '#kontak',
                    'carousel_items' => [
                        [
                            'id' => 'slide-1',
                            'type' => 'video',
                            'sourceType' => 'url',
                            'url' => '/assets/beranda/hero/hero-video.mp4',
                        ],
                        [
                            'id' => 'slide-2',
                            'type' => 'image',
                            'sourceType' => 'url',
                            'url' => 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
                        ],
                    ],
                ]
            );
        }
    }
}
