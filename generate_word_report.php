<?php

$cacheFile = __DIR__ . '/test_results_cache.json';
if (!file_exists($cacheFile)) {
    die("Cache file not found.\n");
}

$data = json_decode(file_get_contents($cacheFile), true);
$items = $data['items'];
$total = $data['total'];
$passed = $data['passed'];
$failed = $data['failed'];
$passRate = $data['passRate'];
$executedAt = $data['executedAt'];

$outputDocx = __DIR__ . '/LAPORAN_PENGUJIAN_FITUR_PEB_APP.docx';

// Helper to escape XML
function xmlEscape($str) {
    return htmlspecialchars($str, ENT_QUOTES | ENT_XML1, 'UTF-8');
}

// Build table rows for WordprocessingML
$tableRowsXml = '';

// Header row
$tableRowsXml .= '
<w:tr>
    <w:trPr>
        <w:tblHeader/>
    </w:trPr>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="600" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>No</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="1800" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>Kategori</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="2200" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>Nama Fitur</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="3000" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>Skenario Uji</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="1100" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>Status</w:t></w:r></w:p>
    </w:tc>
    <w:tc>
        <w:tcPr>
            <w:tcW w:w="2500" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="003366"/>
            <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        </w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>Keterangan &amp; Catatan</w:t></w:r></w:p>
    </w:tc>
</w:tr>';

$no = 1;
foreach ($items as $item) {
    $bg = ($no % 2 === 0) ? 'F4F8FA' : 'FFFFFF';
    $statusText = $item['isPass'] ? 'PASS' : 'FAIL';
    $statusColor = $item['isPass'] ? '107C41' : 'D83B01';
    $statusBg = $item['isPass'] ? 'DFF6DD' : 'FDE7E9';

    $tableRowsXml .= '
    <w:tr>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="600" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $bg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="17"/><w:color w:val="444444"/></w:rPr><w:t>' . $no . '</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1800" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $bg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:r><w:rPr><w:b/><w:sz w:val="17"/><w:color w:val="003366"/></w:rPr><w:t>' . xmlEscape($item['category']) . '</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="2200" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $bg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:r><w:rPr><w:b/><w:sz w:val="17"/><w:color w:val="222222"/></w:rPr><w:t>' . xmlEscape($item['feature']) . '</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="3000" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $bg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="333333"/></w:rPr><w:t>' . xmlEscape($item['testCase']) . '</w:t></w:r></w:p>
            <w:p><w:r><w:rPr><w:sz w:val="14"/><w:color w:val="777777"/></w:rPr><w:t>Endpoint: [' . xmlEscape($item['method']) . '] ' . xmlEscape($item['target']) . ' (' . $item['timeMs'] . 'ms)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1100" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $statusBg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="17"/><w:color w:val="' . $statusColor . '"/></w:rPr><w:t>' . $statusText . '</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="2500" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="' . $bg . '"/>
                <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="444444"/></w:rPr><w:t>' . xmlEscape($item['notes']) . '</w:t></w:r></w:p>
        </w:tc>
    </w:tr>';
    $no++;
}

// Build document.xml
$documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <w:body>
        <!-- Header Title Banner -->
        <w:p>
            <w:pPr>
                <w:pBdr>
                    <w:bottom w:val="single" w:sz="18" w:space="8" w:color="003366"/>
                </w:pBdr>
                <w:spacing w:after="160"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:color w:val="003366"/>
                    <w:sz w:val="44"/>
                </w:rPr>
                <w:t>LAPORAN HASIL PENGUJIAN FITUR SISTEM</w:t>
            </w:r>
        </w:p>

        <w:p>
            <w:pPr><w:spacing w:after="240"/></w:pPr>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:color w:val="008080"/>
                    <w:sz w:val="26"/>
                </w:rPr>
                <w:t>PT PELAYANAN ENERGI BATAM (PEB) - DANANTARA INDONESIA</w:t>
            </w:r>
        </w:p>

        <!-- Executive Metadata Box -->
        <w:tbl>
            <w:tblPr>
                <w:tblW w:w="11200" w:type="dxa"/>
                <w:tblBorders>
                    <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                    <w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                    <w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="EEEEEE"/>
                    <w:insideV w:val="none"/>
                </w:tblBorders>
            </w:tblPr>
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="3000" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>Aplikasi / Proyek</w:t></w:r></w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="8200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="111111"/></w:rPr><w:t>PEB Company Profile &amp; Procurement Admin Panel (peb-app)</w:t></w:r></w:p>
                </w:tc>
            </w:tr>
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="3000" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>Lingkungan Pengujian</w:t></w:r></w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="8200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="111111"/></w:rPr><w:t>Laravel 11.x, Inertia.js React, PHP 8.3, MariaDB / MySQL, Vite 8 Dev Server</w:t></w:r></w:p>
                </w:tc>
            </w:tr>
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="3000" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>Waktu Pelaksanaan Uji</w:t></w:r></w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="8200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="111111"/></w:rPr><w:t>' . xmlEscape($executedAt) . '</w:t></w:r></w:p>
                </w:tc>
            </w:tr>
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="3000" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>Tingkat Kelulusan (Pass Rate)</w:t></w:r></w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="8200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="E6F4EA"/></w:tcPr>
                    <w:p><w:r><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="137333"/></w:rPr><w:t>' . $passRate . '% (' . $passed . ' Lulus / ' . $total . ' Pengujian)</w:t></w:r></w:p>
                </w:tc>
            </w:tr>
        </w:tbl>

        <w:p><w:pPr><w:spacing w:before="300" w:after="160"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="003366"/></w:rPr><w:t>1. Ringkasan Eksekutif &amp; Cakupan Pengujian</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t>Pengujian komprehensif ini dilakukan untuk memverifikasi fungsionalitas, keamanan, dan keandalan sistem PT Pelayanan Energi Batam secara menyeluruh (End-to-End). Pengujian mencakup 7 pilar utama sistem:</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Frontend Publik:</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Pengujian seluruh halaman landing page (Beranda, Profil, Servis, Galeri, Kebijakan, Berita, Pengadaan, dan Kontak).</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Autentikasi &amp; Redirection:</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Validasi keamanan login, penanganan URL intended, serta redirect otomatis /dashboard ke /panel-admin.</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Manajemen Pengguna &amp; RBAC:</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Pengujian hak akses role Super Admin, Admin, dan Admin Pengadaan dengan isolasi modul yang ketat.</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Content Management System (CMS):</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Uji modul editor pada 26 tab panel admin dari Hero Section, Visi Misi, Tim, Layanan, hingga Laporan.</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Audit Log &amp; Riwayat Aktivitas:</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Pencatatan real-time perubahan, penambahan, edit, hapus, serta riwayat login yang dapat diakses penuh oleh role Admin.</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>• Optimasi SEO:</w:t></w:r><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="333333"/></w:rPr><w:t> Verifikasi dynamic meta title, Open Graph, dan meta keywords di seluruh rute publik.</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:before="300" w:after="160"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="003366"/></w:rPr><w:t>2. Matriks Detail Hasil Uji Fitur (Test Results Matrix)</w:t></w:r></w:p>

        <!-- Main Test Results Table -->
        <w:tbl>
            <w:tblPr>
                <w:tblW w:w="11200" w:type="dxa"/>
                <w:tblBorders>
                    <w:top w:val="single" w:sz="6" w:space="0" w:color="003366"/>
                    <w:left w:val="single" w:sz="4" w:space="0" w:color="DDDDDD"/>
                    <w:bottom w:val="single" w:sz="6" w:space="0" w:color="003366"/>
                    <w:right w:val="single" w:sz="4" w:space="0" w:color="DDDDDD"/>
                    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="EEEEEE"/>
                    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="EEEEEE"/>
                </w:tblBorders>
            </w:tblPr>
            ' . $tableRowsXml . '
        </w:tbl>

        <w:p><w:pPr><w:spacing w:before="360" w:after="160"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="003366"/></w:rPr><w:t>3. Catatan Implementasi &amp; Peningkatan Sistem Terkini</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="003366"/></w:rPr><w:t>A. Antarmuka Login Minimalis &amp; Elegan</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="444444"/></w:rPr><w:t>Tampilan autentikasi telah disempurnakan dengan hanya menampilkan logo kemitraan Danantara Indonesia dan PT Pelayanan Energi Batam pada sudut kiri atas dan kartu utama di tengah digantikan dengan copywriting singkat yang tegas ("Energi Bagi Negeri - Solusi energi terintegrasi dan andal untuk kemajuan Batam").</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="003366"/></w:rPr><w:t>B. Live Audit Logging &amp; Hak Akses Riwayat Admin</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="444444"/></w:rPr><w:t>Card "Aktivitas Terkini" pada Dashboard kini tersinkronisasi 100% dengan database secara live. Role Admin memiliki otoritas penuh memantau riwayat login, penambahan data, pengeditan, serta penghapusan akun dari seluruh user terdaftar.</w:t></w:r></w:p>

        <w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="003366"/></w:rPr><w:t>C. Penanganan Alur Routing &amp; Kompilasi Vite</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="240"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="444444"/></w:rPr><w:t>Semua rute Starter Kit (/dashboard) dialihkan otomatis ke /panel-admin tanpa menimbulkan halaman kosong. Generator rute TypeScript Wayfinder telah terkompilasi penuh sehingga modul panel admin dapat diakses tanpa hambatan.</w:t></w:r></w:p>

        <!-- Sign-off block -->
        <w:p><w:pPr><w:spacing w:before="400" w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="003366"/><w:sz w:val="20"/></w:rPr><w:t>Disusun Oleh:</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="333333"/></w:rPr><w:t>Tim Quality Assurance &amp; Sistem Engineer PEB</w:t></w:r></w:p>
        <w:p><w:pPr><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="555555"/></w:rPr><w:t>PT Pelayanan Energi Batam (Danantara Indonesia Group)</w:t></w:r></w:p>

        <w:sectPr>
            <w:pgSz w:w="12240" w:h="15840" w:orient="portrait"/>
            <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/>
        </w:sectPr>
    </w:body>
</w:document>';

// Standard OpenXML Package Files
$contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>';

$relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>';

// Create the DOCX ZIP archive
$zip = new ZipArchive();
if ($zip->open($outputDocx, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Cannot open {$outputDocx}\n");
}

$zip->addFromString('[Content_Types].xml', $contentTypesXml);
$zip->addFromString('_rels/.rels', $relsXml);
$zip->addFromString('word/document.xml', $documentXml);

$zip->close();

echo "File Word berhasil dibuat di: {$outputDocx}\n";

