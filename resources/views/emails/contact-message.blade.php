<x-mail::message :message="$message ?? null">
# Pesan Baru dari Hubungi Kami

Halo {{ $contactMessage->name }},

Terdapat pesan baru yang dikirimkan melalui formulir **Hubungi Kami** di website resmi PT Pelayanan Energi Batam. Berikut adalah rincian informasi dan isi pesan tersebut:

<x-mail::panel>
**Detail Pengirim:**
- **Nama Lengkap:** {{ $contactMessage->name }}
- **Alamat Email:** {{ $contactMessage->email }}
- **Subjek / Perihal:** {{ $contactMessage->subject }}
- **Waktu Pengiriman:** {{ $contactMessage->created_at->timezone('Asia/Jakarta')->format('d F Y, H:i') }} WIB
</x-mail::panel>

### Isi Pesan:
{{ $contactMessage->message }}

Silakan segera merespons pesan ini melalui alamat email pengirim di atas untuk memberikan tanggapan terbaik bagi pelanggan.

Terima kasih.
</x-mail::message>
