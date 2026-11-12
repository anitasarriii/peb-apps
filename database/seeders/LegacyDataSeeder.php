<?php

namespace Database\Seeders;

use App\Models\BeritaSection;
use App\Models\DaftarPengadaan;
use App\Models\DaftarPortfolioSection;
use App\Models\DaftarServisSection;
use App\Models\PartnerSectionBeranda;
use App\Models\TimSectionTentang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LegacyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Aman dijalankan berkali-kali — tidak akan duplikasi data.
     * Duplikasi dicegah dengan mengecek apakah ID dengan prefix 'legacy_' sudah ada.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/legacy_data.json');

        if (! File::exists($jsonPath)) {
            $this->command->warn("Legacy data JSON not found at {$jsonPath}");

            return;
        }

        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        if (! $data) {
            $this->command->error('Invalid JSON format in legacy data.');

            return;
        }

        $events = $data['tbl_event'] ?? [];
        $normalizedEvents = [];
        foreach ($events as $e) {
            $normalizedEvents[] = [
                'news_id' => 'event_'.($e['event_id'] ?? uniqid()),
                'news_title' => $e['event_title'] ?? '',
                'news_content_short' => $e['event_content_short'] ?? strip_tags(substr($e['event_content'] ?? '', 0, 100)),
                'news_date' => $e['event_start_date'] ?? date('Y-m-d'),
                'photo' => $e['photo'] ?? '',
            ];
        }
        $this->seedBerita($data['tbl_news'] ?? []);
        $this->seedPartner($data['tbl_client'] ?? []);
        $this->seedServis($data['tbl_service'] ?? []);
        $this->seedPortfolio($data['tbl_portfolio'] ?? []);
        $this->seedTeam($data['tbl_team_member'] ?? []);

        $this->command->info('Legacy data seeded successfully (no duplicates).');
    }

    /**
     * Helper: build an index of existing item IDs for O(1) duplicate check.
     */
    private function existingIds(array $items): array
    {
        return array_flip(array_filter(array_column($items, 'id')));
    }

    private function seedBerita(array $rows)
    {
        $section = BeritaSection::firstOrCreate(
            ['id' => 1],
            ['section_title' => 'Berita & Acara', 'section_desc' => 'Arsip berita legacy', 'items' => []]
        );
        $items = is_array($section->items) ? $section->items : [];
        $existing = $this->existingIds($items);
        $added = 0;

        foreach ($rows as $row) {
            $title = $row['news_title'] ?? '';
            if (stripos($title, 'qurban') !== false || stripos($title, 'penyembelihan') !== false) {
                continue;
            }
            $id = 'legacy_news_'.($row['news_id'] ?? uniqid());
            if (isset($existing[$id])) {
                continue; // skip duplicate
            }
            $items[] = [
                'id' => $id,
                'title' => $row['news_title'] ?? '',
                'subtitle' => $row['news_content_short'] ?? strip_tags(substr($row['news_content'] ?? '', 0, 100)),
                'date' => $row['news_date'] ?? date('Y-m-d'),
                'imageSrc' => ! empty($row['photo']) ? 'https://peb.co.id/public/uploads/'.$row['photo'] : '',
                'gallery' => [],
            ];
            $existing[$id] = true;
            $added++;
        }

        $section->items = $items;
        $section->save();
        $this->command->info("  Berita: {$added} item baru ditambahkan (total: ".count($items).')');
    }

    private function seedPengadaan(array $rows)
    {
        $categories = ['Tender Terbuka', 'Beauty Contest', 'Seleksi Mitra', 'Pengumuman Pemenang'];
        $section = DaftarPengadaan::firstOrCreate(
            ['id' => 1],
            ['section_title' => 'Daftar Pengadaan', 'categories' => $categories, 'items' => []]
        );
        $section->categories = $categories;
        $items = [];

        foreach ($rows as $row) {
            $id = (int)($row['event_id'] ?? uniqid());
            $title = trim($row['event_title'] ?? '');
            $content = $row['event_content'] ?? '';

            if (stripos($title, 'Pemenang') !== false) {
                $category = 'Pengumuman Pemenang';
            } elseif (stripos($title, 'Beauty Contest') !== false) {
                $category = 'Beauty Contest';
            } elseif (stripos($title, 'DPT') !== false || stripos($title, 'Penyedia Terseleksi') !== false || stripos($title, 'Seleksi Mitra') !== false) {
                $category = 'Seleksi Mitra';
            } else {
                $category = 'Tender Terbuka';
            }

            $dokumenList = [];
            preg_match_all('/<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/si', $content, $aMatches, PREG_SET_ORDER);
            $docIdx = 1;
            foreach ($aMatches as $m) {
                $url = trim($m[1]);
                $text = trim(strip_tags($m[2]));
                if (strpos($url, 'mailto:') === false) {
                    $docName = (!empty($text) && strtolower($text) !== 'download') ? $text : 'Dokumen Pengumuman Pengadaan';
                    $dokumenList[] = [
                        'id' => 'doc_event_'.$id.'_'.$docIdx++,
                        'name' => html_entity_decode($docName, ENT_QUOTES, 'UTF-8'),
                        'fileSize' => 'Tautan Resmi Google Drive',
                        'sourceType' => 'url',
                        'fileUrl' => $url,
                        'fileName' => 'Dokumen-Pengumuman-'.$id,
                    ];
                }
            }

            $syaratList = [];
            $syaratIdx = 1;
            if (preg_match_all('/<li[^>]*>(.*?)<\/li>/si', $content, $liMatches)) {
                foreach ($liMatches[1] as $li) {
                    $cleanLi = trim(preg_replace('/\s+/', ' ', strip_tags($li)));
                    $cleanLi = html_entity_decode($cleanLi, ENT_QUOTES, 'UTF-8');
                    $cleanLi = trim(str_replace("\xc2\xa0", ' ', $cleanLi));
                    if (!empty($cleanLi) && strlen($cleanLi) > 5) {
                        $syaratList[] = [
                            'id' => 'syarat_event_'.$id.'_'.$syaratIdx++,
                            'text' => $cleanLi,
                        ];
                    }
                }
            }

            if (empty($syaratList)) {
                preg_match_all('/<p[^>]*>(.*?)<\/p>/si', $content, $pMatches);
                foreach ($pMatches[1] as $p) {
                    $cleanP = trim(preg_replace('/\s+/', ' ', strip_tags($p)));
                    $cleanP = html_entity_decode($cleanP, ENT_QUOTES, 'UTF-8');
                    $cleanP = trim(str_replace("\xc2\xa0", ' ', $cleanP));
                    if (preg_match('/^(\d+[\.\)]|[a-z][\.\)])\s*(.+)/i', $cleanP)) {
                        $syaratList[] = [
                            'id' => 'syarat_event_'.$id.'_'.$syaratIdx++,
                            'text' => $cleanP,
                        ];
                    }
                }
            }

            $cleanHtml = $content;
            $cleanHtml = preg_replace('/class=["\']Mso[^"\']*["\']/i', '', $cleanHtml);
            $cleanHtml = preg_replace('/style=["\'][^"\']*mso-[^"\']*["\']/i', '', $cleanHtml);
            $cleanHtml = preg_replace('/style=["\'][^"\']*font-family:[^"\']*["\']/i', '', $cleanHtml);
            $cleanHtml = preg_replace('/<!--\[if[^\]]*\]>.*?<!\[endif\]-->/s', '', $cleanHtml);
            $cleanHtml = preg_replace('/<o:p>.*?<\/o:p>/i', '', $cleanHtml);
            $cleanHtml = str_replace('https://peb.co.id/public/uploads/', '/storage/daftar-pengadaan-images/', $cleanHtml);

            $items[] = [
                'id' => 'legacy_event_'.$id,
                'title' => $title,
                'status' => 'TUTUP',
                'isArchived' => true,
                'startDate' => $row['event_start_date'] ?? date('Y-m-d'),
                'endDate' => $row['event_end_date'] ?? date('Y-m-d'),
                'date' => $row['event_start_date'] ?? date('Y-m-d'),
                'location' => $row['event_location'] ?? 'Batam, Kepulauan Riau',
                'category' => $category,
                'imageSrc' => !empty($row['photo']) ? '/storage/daftar-pengadaan-images/'.$row['photo'] : '',
                'bannerImage' => !empty($row['banner']) ? '/storage/daftar-pengadaan-images/'.$row['banner'] : '',
                'imageSourceType' => 'upload',
                'deskripsi' => trim($cleanHtml),
                'syaratList' => $syaratList,
                'dokumenList' => $dokumenList,
                'mapsMode' => !empty($row['event_map']) ? 'embed' : 'koordinat',
                'mapsEmbedUrl' => $row['event_map'] ?? '',
                'mapsKoordinat' => '',
                'mapsLabel' => $row['event_location'] ?? 'Batam, Kepulauan Riau',
            ];
        }

        $section->items = $items;
        $section->save();
        $this->command->info("  Pengadaan: ".count($items)." item arsip pengadaan berhasil dimigrasikan.");
    }

    private function seedPartner(array $rows)
    {
        $section = PartnerSectionBeranda::firstOrCreate(
            ['id' => 1],
            ['title' => 'Klien Kami', 'partners' => []]
        );
        $partners = is_array($section->partners) ? $section->partners : [];
        $existing = $this->existingIds($partners);
        $added = 0;

        foreach ($rows as $row) {
            $id = 'legacy_client_'.($row['id'] ?? uniqid());
            if (isset($existing[$id])) {
                continue;
            }
            $partners[] = [
                'id' => $id,
                'name' => $row['name'] ?? 'Client',
                'logoSrc' => ! empty($row['photo']) ? 'https://peb.co.id/public/uploads/'.$row['photo'] : '',
            ];
            $existing[$id] = true;
            $added++;
        }

        $section->partners = $partners;
        $section->save();
        $this->command->info("  Partner: {$added} item baru ditambahkan (total: ".count($partners).')');
    }

    private function seedServis(array $rows)
    {
        $section = DaftarServisSection::firstOrCreate(
            ['id' => 1],
            ['title' => 'Layanan', 'services' => []]
        );
        $services = is_array($section->services) ? $section->services : [];
        $existing = $this->existingIds($services);
        $added = 0;

        foreach ($rows as $row) {
            $id = 'legacy_service_'.($row['id'] ?? uniqid());
            if (isset($existing[$id])) {
                continue;
            }
            $services[] = [
                'id' => $id,
                'title' => $row['name'] ?? 'Layanan',
                'description' => $row['short_description'] ?? strip_tags(substr($row['description'] ?? '', 0, 100)),
                'imageSrc' => ! empty($row['photo']) ? 'https://peb.co.id/public/uploads/'.$row['photo'] : '',
            ];
            $existing[$id] = true;
            $added++;
        }

        $section->services = $services;
        $section->save();
        $this->command->info("  Servis: {$added} item baru ditambahkan (total: ".count($services).')');
    }

    private function seedPortfolio(array $rows)
    {
        $section = DaftarPortfolioSection::firstOrCreate(
            ['id' => 1],
            ['section_title' => 'Portfolio PEB', 'categories' => ['gas', 'power'], 'items' => []]
        );
        $section->categories = ['gas', 'power'];
        $items = is_array($section->items) ? $section->items : [];
        $existing = $this->existingIds($items);
        $added = 0;

        foreach ($rows as $row) {
            $id = 'legacy_portfolio_'.($row['id'] ?? uniqid());
            if (isset($existing[$id])) {
                continue;
            }
            $catId = (int)($row['category_id'] ?? 0);
            $categoryKey = ($catId === 4) ? 'gas' : (($catId === 5) ? 'power' : 'gas');
            $badge = ($catId === 4) ? 'GAS INFRASTRUCTURE' : 'POWER PLANT';
            $items[] = [
                'id' => $id,
                'title' => $row['name'] ?? 'Portfolio',
                'category' => $categoryKey,
                'badge' => $badge,
                'imageSrc' => ! empty($row['photo']) ? '/storage/daftar-portfolio-items/'.$row['photo'] : '',
                'imageSourceType' => 'upload',
                'date' => ! empty($row['start_date']) ? substr($row['start_date'], 0, 4) : date('Y'),
                'description' => $row['short_content'] ?? strip_tags(substr($row['content'] ?? '', 0, 100)),
                'client' => $row['client_name'] ?? 'PT Pelayanan Energi Batam',
                'location' => $row['client_company'] ?? 'Batam, Kepulauan Riau',
                'efficiency' => (! empty($row['cost']) && $row['cost'] !== '0') ? 'Nilai Kontrak: '.$row['cost'] : 'Proyek Strategis PEB',
            ];
            $existing[$id] = true;
            $added++;
        }

        $section->items = $items;
        $section->save();
        $this->command->info("  Portfolio: {$added} item baru ditambahkan (total: ".count($items).')');
    }

    private function seedTeam(array $rows)
    {
        $section = TimSectionTentang::firstOrCreate(
            ['id' => 1],
            ['title' => 'Tim Kami', 'subtitle' => '', 'members' => []]
        );
        $members = is_array($section->members) ? $section->members : [];
        $existing = $this->existingIds($members);
        $added = 0;

        foreach ($rows as $row) {
            $id = 'legacy_team_'.($row['id'] ?? uniqid());
            if (isset($existing[$id])) {
                continue;
            }
            $members[] = [
                'id' => $id,
                'name' => $row['name'] ?? 'Anggota',
                'role' => $row['designation'] ?? 'Staff',
                'image' => ! empty($row['photo']) ? 'https://peb.co.id/public/uploads/'.$row['photo'] : '',
                'socials' => [],
            ];
            $existing[$id] = true;
            $added++;
        }

        $section->members = $members;
        $section->save();
        $this->command->info("  Tim: {$added} item baru ditambahkan (total: ".count($members).')');
    }
}
