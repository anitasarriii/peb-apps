<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'read_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read_by' => 'array',
    ];

    /**
     * Get the user who triggered the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper static untuk mencatat aktivitas/notifikasi baru.
     */
    public static function log(?User $user, string $type, string $title, string $message): self
    {
        return self::create([
            'user_id' => $user?->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'read_by' => [], // Mulai dengan array kosong (belum dibaca oleh siapa pun)
        ]);
    }
}
