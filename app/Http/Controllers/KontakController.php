<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageSubmitted;
use App\Models\ContactMessage;
use App\Models\HeroSectionKontak;
use App\Models\Notification;
use App\Models\SeoMeta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class KontakController extends Controller
{
    /**
     * Render the Hubungi Kami (Contact Us) page.
     */
    public function index(Request $request): Response
    {
        $seoMeta = SeoMeta::where('page_type', 'kontak')->first();
        $heroKontak = HeroSectionKontak::first();

        return Inertia::render('kontak', [
            'seoMeta' => $seoMeta,
            'heroKontak' => $heroKontak,
        ]);
    }

    /**
     * Process the Contact Us message form submission.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contactMessage = ContactMessage::create($validated);

        Notification::log(
            null,
            'info',
            'Pesan Kontak Baru',
            "Pesan baru dari {$validated['name']} ({$validated['email']}) mengenai: \"{$validated['subject']}\""
        );

        // Kirim email notifikasi ke admin jika mailer aktif (tetap simpan pesan meski SMTP belum dikonfigurasi)
        $adminEmail = config('mail.from.address');
        if ($adminEmail) {
            try {
                Mail::to($adminEmail)->send(new ContactMessageSubmitted($contactMessage));
            } catch (\Throwable $e) {
                \Log::warning('Contact email notification skipped: '.$e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Pesan Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda kembali!');
    }
}
