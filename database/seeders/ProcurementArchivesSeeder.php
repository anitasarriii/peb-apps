<?php

namespace Database\Seeders;

use App\Models\DaftarPengadaan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProcurementArchivesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $legacyDataFile = database_path('data/legacy_data.json');
        if (!File::exists($legacyDataFile)) {
            $this->command->warn('legacy_data.json tidak ditemukan.');
            return;
        }

        $data = json_decode(File::get($legacyDataFile), true, 512, JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($data): void {
            $categories = ['Tender Terbuka', 'Beauty Contest', 'Seleksi Mitra', 'Pengumuman Pemenang'];
            $section = DaftarPengadaan::firstOrCreate(
                ['id' => 1],
                ['section_title' => 'Daftar Pengadaan', 'categories' => $categories, 'items' => []]
            );

            $items = [];
            foreach ($data['tbl_event'] ?? [] as $row) {
                $id = (int)($row['event_id'] ?? 0);
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
                            'id' => 'doc_event_' . $id . '_' . $docIdx++,
                            'name' => html_entity_decode($docName, ENT_QUOTES, 'UTF-8'),
                            'fileSize' => 'Tautan Resmi Google Drive',
                            'sourceType' => 'url',
                            'fileUrl' => $url,
                            'fileName' => 'Dokumen-Pengumuman-' . $id,
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
                                'id' => 'syarat_event_' . $id . '_' . $syaratIdx++,
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
                                'id' => 'syarat_event_' . $id . '_' . $syaratIdx++,
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
                    'id' => 'legacy_event_' . $id,
                    'title' => $title,
                    'status' => 'TUTUP',
                    'isArchived' => true,
                    'startDate' => $row['event_start_date'] ?? date('Y-m-d'),
                    'endDate' => $row['event_end_date'] ?? date('Y-m-d'),
                    'date' => $row['event_start_date'] ?? date('Y-m-d'),
                    'location' => $row['event_location'] ?? 'Batam, Kepulauan Riau',
                    'category' => $category,
                    'imageSrc' => !empty($row['photo']) ? '/storage/daftar-pengadaan-images/' . $row['photo'] : '',
                    'bannerImage' => !empty($row['banner']) ? '/storage/daftar-pengadaan-images/' . $row['banner'] : '',
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

            $section->update([
                'section_title' => 'Daftar Pengadaan',
                'categories' => $categories,
                'items' => $items,
            ]);

            $this->command->info('Procurement archives seeded: ' . count($items) . ' items.');
        });
    }
}
